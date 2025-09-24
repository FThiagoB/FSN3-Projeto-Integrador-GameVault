const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Estados permitidos para as transações
const allowedStatus = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const allowedPaymentStatus = ['pending', 'paid', 'failed', 'refunded'];

// Por enquanto isso é fixo
const shippingMethods = [
    { id: 'standard', name: 'Entrega Padrão', cost: 10.00, deliveryDays: '5-7' },
    { id: 'express', name: 'Entrega Expressa', cost: 25.00, deliveryDays: '2-3' }
];

// Por enquanto isso é fixo
const paymentMethods = [
    { id: 'credit_card', name: 'Cartão de Crédito' },
];

// Função para gerar externID
const generateExternID = (id) => {
    let base36 = id.toString(36).toUpperCase();
    base36 = base36.padStart(8, '0');
    return base36.replace(/(\w{4})(\w{4})/, 'ORD$1-$2');
};

// Função para pegar uma descrição do pagamento
const getPaymentDescription = (type, data) => {
    if (type === "credit_card") {
        let cardNumber = data.number;
        let hidden_cardNumber = cardNumber.replace(/(^\w{4}).*.(\w{2})$/, `$1${"*".repeat((cardNumber.length - 11))}$2`)
        return hidden_cardNumber;
    }

    return "";
};

function getOrderStatusFromItems(items) {
    const statuses = items.map(item => item.status);

    const all = (status) => statuses.every(s => s === status);
    const some = (status) => statuses.some(s => s === status);

    if (all('cancelled')) return 'cancelled';
    if (all('pending')) return 'pending';
    if (all('shipped')) return 'shipped';
    if (all('delivered')) return 'completed';

    if (some('shipped') && some('pending')) return 'partially_shipped';
    if (some('cancelled') && some(s => s !== 'cancelled')) return 'partially_cancelled';
    if (some('delivered') && !all('delivered')) return 'partially_completed';

    return 'processing'; // fallback genérico
}

exports.validateCart = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty or invalid" });
        }

        let subtotal = 0;
        const validatedItems = [];
        const errors = [];

        for (const item of items) {
            const game = await prisma.game.findUnique({
                where: { id: item.gameID },
                select: { id: true, title: true, price: true, stock: true },
            });

            if (!game) {
                errors.push({ gameID: item.gameID, message: "Game not found" });
                continue;
            }

            if (game.stock <= 0) {
                errors.push({ gameID: game.id, title: game.title, message: "Out of stock" });
                continue;
            }

            if (item.quantity > game.stock) {
                errors.push({
                    gameID: game.id,
                    title: game.title,
                    message: `Insufficient stock, available: ${game.stock}`,
                });
                continue;
            }

            const itemTotal = game.price * item.quantity;
            subtotal += itemTotal;

            validatedItems.push({
                gameID: game.id,
                title: game.title,
                unitPrice: game.price,
                quantity: item.quantity,
                itemTotal,
            });
        }

        res.status(200).json({
            valid: errors.length === 0,
            subtotal,
            items: validatedItems,
            errors,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getCheckoutInfo = async (req, res) => {
    /*
        Serve para o frontend resgatar informações necessárias para exibir as opções de endereços (caso o usuário já tenha cadastrado), métodos de envio, 
       métodos de pagamento, e também para saber o que falta
    */
    try {
        const userID = parseInt(req.user.id);

        // Busca informações do usuário com seus endereços e métodos de pagamento
        const user = await prisma.user.findUnique({
            where: { id: userID },
            include: {
                addresses: {
                    orderBy: { isDefaultShipping: 'desc' } // Endereços padrão primeiro
                },
                paymentMethods: {
                    where: { isActive: true }
                },
                defaultAddress: true,
                defaultPaymentMethod: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Busca todos os métodos de envio ativos
        const shippingMethods = await prisma.shippingMethod.findMany({
            where: { isActive: true }
        });

        // Formata os métodos de envio para manter compatibilidade com o frontend
        const formattedShippingMethods = shippingMethods.map(method => ({
            id: method.id.toString(), // Mantém como string para compatibilidade
            name: method.name,
            cost: method.price,
            description: method.description
        }));

        // Formata os métodos de pagamento do usuário
        const formattedPaymentMethods = user.paymentMethods.map(method => ({
            id: method.id.toString(), // Mantém como string para compatibilidade
            type: method.type,
            // Adiciona name baseado no type para compatibilidade
            name: method.type === 'credit_card' ? 'Cartão de Crédito' :
                method.type === 'debit_card' ? 'Cartão de Débito' :
                    method.type === 'pix' ? 'PIX' :
                        method.type === 'bank_transfer' ? 'Transferência Bancária' : method.type,
            details: method.details
        }));

        // Determina o endereço padrão (o marcado como default ou o primeiro da lista)
        const defaultAddress = user.addresses.find(addr => addr.isDefaultShipping) ||
            (user.addresses.length > 0 ? user.addresses[0] : null);

        res.status(200).json({
            user: {
                hasAddress: user.addresses.length > 0,
                hasPaymentMethod: user.paymentMethods.length > 0,
                addresses: user.addresses,
                address: defaultAddress // Mantém compatibilidade com campo address
            },
            shippingMethods: formattedShippingMethods,
            paymentMethods: formattedPaymentMethods.length > 0 ?
                formattedPaymentMethods :
                // Fallback para manter compatibilidade se não houver métodos cadastrados
                [{ id: 'credit_card', name: 'Cartão de Crédito' }]
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.processCheckout = async (req, res) => {
    try {
        if (!req.body) req.body = {};
        const { shippingAddress, paymentMethod, shippingMethod, couponCode = "", items, tax = 0 } = req.body;

        const userID = parseInt(req.user.id);
        let addressID;
        let subtotal = 0;

        // Validar dados de entrada
        if (!shippingAddress || !paymentMethod || !shippingMethod || !items)
            return res.status(400).json({ message: "Specify all required fields" });

        if (shippingAddress) {
            const { street, number, complemento, neighborhood, city, state, zipCode } = shippingAddress;
            if (!street || !number || !neighborhood || !city || !state || !zipCode)
                return res.status(400).json({ message: "Invalid delivery address" });
        }

        if (!items || !Array.isArray(items) || items.length === 0)
            return res.status(400).json({ message: "Invalid product list" });

        // Criar transação para garantir atomicidade
        const result = await prisma.$transaction(async (prisma) => {
            // Address - Usa os dados de endereço informados para procurar ou criar um novo endereço
            if (shippingAddress) {
                // Verifica se o endereço já está no banco
                const existingAddress = await prisma.address.findFirst({
                    where: {
                        userID: userID,
                        zipCode: shippingAddress.zipCode,
                        number: shippingAddress.number
                    }
                });

                if (existingAddress)
                    addressID = existingAddress.id;

                else {
                    // Cria um novo endereço
                    const newAddress = await prisma.address.create({
                        data: {
                            userID: userID,
                            ...shippingAddress // Desconstroi o objeto
                        }
                    });

                    addressID = newAddress.id;
                }
            }
            // Address: producra algum endereço válido do usuário
            else {
                const existingAddress = await prisma.address.findFirst({
                    where: {
                        id: shippingAddress.id,
                        userID: userID
                    }
                });

                if (!existingAddress)
                    throw new Error('Specified address is invalid');

                addressID = shippingAddress.id;
            }

            // Address: producra se há o método de pagamento no banco
            const registerPaymentMethod = await prisma.paymentMethod.create({
                data: {
                    userID: userID,
                    ...paymentMethod
                }
            })

            // Calcular subtotal e validar itens
            const orderItems = [];

            for (const item of items) {
                const game = await prisma.game.findUnique({
                    where: { id: item.id },
                    select: { id: true, title: true, price: true, stock: true }
                });

                if (!game)
                    throw new Error(`Specified game (id: ${item.gameID}) not found.`);

                if (game.stock < item.quantity)
                    throw new Error(`Insufficient stock for the item: "${game.title}"`);

                const itemTotal = game.price * item.quantity;
                subtotal += itemTotal;

                // Armazena a informação bruta para montar os itens do pedido
                orderItems.push({
                    gameID: game.id,
                    quantity: item.quantity,
                    unitPrice: game.price,
                    status: "pending",
                });
            }

            // --- Frete ---
            const selectedShipping = await prisma.shippingMethod.findUnique({
                where: { id: shippingMethod.id },
            });
            if (!selectedShipping || !selectedShipping.isActive) {
                throw new Error("Invalid shipping method");
            }
            const shippingCost = selectedShipping.price;
            const shippingMethodID = selectedShipping.id;

            // --- Cupom ---
            let couponID = null;
            let discount = 0;
            if (couponCode) {
                const coupon = await prisma.coupon.findFirst({
                    where: {
                        code: couponCode,
                        isActive: true,
                        OR: [
                            { expiresAt: null },
                            { expiresAt: { gt: new Date() } },
                        ],
                    },
                });

                if (!coupon) throw new Error("Invalid or expired coupon");

                if (subtotal >= coupon.minValue) {
                    discount = coupon.discount; // percentual ou valor fixo? (ajuste conforme sua regra)
                    couponID = coupon.id;
                }
            }

            // --- Imposto e total ---
            const total = subtotal + shippingCost + tax - discount;

            // --- Pedido ---
            const order = await prisma.order.create({
                data: {
                    userID,
                    shippingAddressID: addressID,
                    paymentMethodID: registerPaymentMethod.id,
                    shippingMethodID,
                    couponID,
                    status: "pending",
                    paymentStatus: "pending",
                    subtotal,
                    shippingCost,
                    tax,
                    total,
                    discount,
                    items: {
                        create: orderItems,
                    },
                },
            });

            // Reduz estoque dos jogos
            for (const item of items) {
                await prisma.game.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            return order;
        });

        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.getTransactionsByJWT = async (req, res) => {
    try {
        const userID = parseInt(req.user.id);
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        // filtro
        const where = { userID: userID };
        if (status) where.status = status;

        // Pega o total de pedidos
        const totalOrders = await prisma.order.count({ where });

        // Pega as informações dos pedidos
        const orders = await prisma.order.findMany({
            where,
            skip,
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    select: {
                        game: {
                            select: { id: true, title: true, image: true }
                        },
                        status: true,
                        unitPrice: true,
                        quantity: true,
                    },
                    
                },
                address: {
                    select: {
                        label: true, street: true, number: true,
                        neighborhood: true, city: true, state: true,
                        zipCode: true
                    }
                },
                paymentMethod: {
                    select: {
                        type: true,
                        data: true
                    }
                }
            }
        })

        if (!orders || orders.length === 0)
            return res.status(404).json({ message: "Transactions not found" })

        // Adiciona imageUrl aos games
        const ordersWithImageUrl = orders.map(order => ({
            ...order,
            externID: generateExternID(order.id),
            paymentMethod: {
                type: order.paymentMethod.type,
                description: getPaymentDescription(order.paymentMethod.type, order.paymentMethod.data)
            },
            items: order.items.map(item => ({
                ...item,
                game: {
                    ...item.game,
                    imageUrl: `${req.protocol}://${req.get("host")}/uploads/games/${item.game.image}`
                },
            }))
        }))

        res.status(200).json({
            orders: ordersWithImageUrl,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalOrders,
                pages: Math.ceil(totalOrders / limit)
            }
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.getTransactionsBySellerJWT = async (req, res) => {
    try {
        const sellerId = parseInt(req.user.id);
        const { page = 1, limit = 10, startDate, endDate } = req.query;
        const skip = (page - 1) * limit;

        // Monta os filtros
        const where = {
            items: {
                some: {
                    game: {
                        sellerID: sellerId
                    }
                }
            }
        };

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        // Buscar pedidos onde o vendedor tem jogos
        const orders = await prisma.order.findMany({
            where,
            skip,
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                address: {
                    select: {
                        label: true,
                        street: true,
                        number: true,
                        neighborhood: true,
                        city: true,
                        state: true,
                        zipCode: true
                    }
                },
                items: {
                    where: {
                        game: {
                            sellerID: sellerId
                        }
                    },
                    select: {
                        game: {
                            select: {
                                id: true,
                                title: true,
                                image: true,
                                price: true,
                                sellerID: true,
                                deleted: true
                            }
                        },
                        status: true,
                        unitPrice: true,
                        quantity: true,
                    }
                },
                paymentMethod: {
                    select: {
                        type: true,
                        data: true
                    }
                }
            },
        });

        if (!orders || !orders.length)
            return res.status(404).json({ message: "Transactions not found" });

        // Contar total de pedidos para paginação
        const totalOrders = await prisma.order.count({ where });

        // Adiciona imageUrl aos games
        const formattedOrders = orders.map(order => {
            // Calcula o valor total recebido pelo vendedor daquele pedido
            const totalSeller = order.items.reduce((sum, item) => {
                return sum + (item.unitPrice * item.quantity);
            }, 0)

            // Remove alguns campos que o vendedor não deve ter acesso
            const { subtotal, discount, tax, couponID, ...filteredOrder } = order;

            return ({
                ...filteredOrder,
                total: totalSeller,
                externID: generateExternID(order.id),
                status: getOrderStatusFromItems(order.items),
                paymentStatus: getOrderStatusFromItems(order.items) === "cancelled"? "cancelled":order.paymentStatus,
                paymentMethod: {
                    type: order.paymentMethod.type,
                    description: getPaymentDescription(order.paymentMethod.type, order.paymentMethod.data),
                },
                items: order.items.map(item => ({
                    ...item,
                    game: {
                        ...item.game,
                        imageUrl: `${req.protocol}://${req.get("host")}/uploads/games/${item.game.image}`
                    },
                }))
            })
        })

        res.status(200).json({
            orders: formattedOrders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalOrders,
                pages: Math.ceil(totalOrders / limit)
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.cancelOrderByClient = async (req, res) => {
    try {
        const { orderID } = req.params;
        const userID = parseInt(req.user.id);

        // Procura o pedido no banco
        const order = await prisma.order.findUnique({
            where: { id: orderID, userID },
        });

        // Existe?
        if (!order)
            return res.status(404).json({ message: "Order not found" });

        // Ainda pode modificar?
        if (!['pending', 'paid'].includes(order.status))
            return res.status(400).json({ message: "The order cannot be canceled in the current status." });

        // Atualiza o pedido
        const updatedOrder = await prisma.order.update({
            where: { id: orderID },
            data: { status: 'cancelled' },
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
};

exports.setStateOrderByClient = async (req, res) => {
    try {
        const { orderID } = req.params;
        const userID = parseInt(req.user.id);

        if (!req.body) req.body = {}
        const { orderStatus } = req.body;

        const valideOrderStatus = ["delivered", "cancelled"]

        if (!orderID || !orderStatus)
            return res.status(400).json({ message: "Problems with the request" });

        // Verificar se o orderID é um número
        if (Number.isNaN(parseInt(orderID)))
            return res.status(400).json({ message: "The ID number must be an integer" });

        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderID), userID },
            include: {
                items: true, // Inclui os itens para verificar seus status
            }
        });

        if (!order)
            return res.status(404).json({ message: "Order not found" });

        if (!valideOrderStatus.includes(orderStatus))
            return res.status(400).json({ message: "Unrecognized Order Status" });

        // Verificar se o pedido já está finalizado (globalmente)
        if (order.status === 'delivered' || order.status === 'cancelled')
            return res.status(400).json({ message: "The order has already been finalized" });

        // Agora, baseado nos itens, vamos verificar a possibilidade de mudança de status
        if (orderStatus === "delivered") {
             // Verificar os status dos itens
            const items = order.items;

            // Verificar se há pelo menos um item shipped (para ser marcado como delivered)
            const hasShippedItem = items.some(item => item.status === 'shipped');
            const hasPendingOrProcessing = items.some(item => item.status === 'pending' || item.status === 'processing');

            if (!hasShippedItem) {
                return res.status(400).json({ message: "Cannot mark as delivered: no items have been shipped." });
            }

            if (hasPendingOrProcessing) {
                return res.status(400).json({ message: "Cannot mark as delivered: there are items pending or processing." });
            }

            // Atualizar o status do pedido para delivered
            const updatedOrder = await prisma.order.update({
                where: { id: parseInt(orderID) },
                data: { status: 'delivered' }
            });

            // Atualizar todos os itens que estão shipped para delivered
            await prisma.orderItem.updateMany({
                where: {
                    orderID: parseInt(orderID),
                    status: 'shipped'
                },
                data: { status: 'delivered' }
            });

            return res.status(200).json(updatedOrder);
        }

        if (orderStatus === "cancelled") {
            const items = order.items;
            // Verificar se há itens shipped ou delivered
            const hasShippedOrDelivered = items.some(item => item.status === 'shipped' || item.status === 'delivered');

            if (hasShippedOrDelivered) {
                return res.status(400).json({ message: "Cannot cancel order: there are items already shipped or delivered." });
            }

            // Atualizar o status do pedido para cancelled
            const updatedOrder = await prisma.order.update({
                where: { id: parseInt(orderID) },
                data: { status: 'cancelled' }
            });

            // Atualizar todos os itens que não estão cancelled para cancelled
            await prisma.orderItem.updateMany({
                where: {
                    orderID: parseInt(orderID),
                    status: { not: 'cancelled' }
                },
                data: { status: 'cancelled' }
            });

            // Ajustar o paymentStatus conforme a lógica anterior
            let newPaymentStatus;

            if (updatedOrder.paymentStatus === "pending")
                newPaymentStatus = "cancelled"

            else if (updatedOrder.paymentStatus === "approved")
                newPaymentStatus = "refunded"

            if (newPaymentStatus) {
                await prisma.order.update({
                    where: { id: parseInt(orderID) },
                    data: { paymentStatus: newPaymentStatus }
                });
            }

            return res.status(200).json(updatedOrder);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
};

exports.cancelOrderBySeller = async (req, res) => {
    try {
        const { orderID } = req.params;
        const sellerID = req.user.id;

        if (!orderID)
            return res.status(400).json({ message: "Order ID is required" });

        // Verificar se orderID é um número válido
        if (Number.isNaN(parseInt(orderID)))
            return res.status(400).json({ message: "The ID number must be an integer" });

        // Buscar o pedido com todos os itens e seus jogos
        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderID) },
            include: {
                items: {
                    include: {
                        game: {
                            select: {
                                id: true,
                                sellerID: true,
                                title: true
                            }
                        }
                    }
                }
            }
        });

        if (!order)
            return res.status(404).json({ message: "Order not found" });

        // Verificar se o pedido já está finalizado
        if (order.status === 'delivered' || order.status === 'cancelled')
            return res.status(400).json({ message: "The order has already been finalized" });

        // Separar itens do vendedor e de outros vendedores
        const sellerItems = order.items.filter(item => item.game.sellerID === sellerID);
        const otherItems = order.items.filter(item => item.game.sellerID !== sellerID);

        if (sellerItems.length === 0)
            return res.status(404).json({ message: "No items found from this seller in the order" });

        // Verificar se há itens do vendedor que já foram enviados ou entregues
        const hasShippedOrDeliveredItems = sellerItems.some(item => 
            item.status === 'shipped' || item.status === 'delivered'
        );

        if (hasShippedOrDeliveredItems) {
            return res.status(400).json({ 
                message: "Cannot cancel items: some items have already been shipped or delivered" 
            });
        }

        // Verificar status dos itens de outros vendedores
        const otherItemsStatus = getOrderStatusFromItems(otherItems);
        const hasOtherActiveItems = otherItems.length > 0 && 
            otherItemsStatus !== 'cancelled' && 
            otherItemsStatus !== 'delivered';

        // Determinar o novo status global do pedido
        let newOrderStatus = order.status;
        let newPaymentStatus = order.paymentStatus;

        if (otherItems.length === 0) {
            // Se não há outros itens, cancelar todo o pedido
            newOrderStatus = 'cancelled';
            if (order.paymentStatus === 'approved') {
                newPaymentStatus = 'refunded';
            } else if (order.paymentStatus === 'pending') {
                newPaymentStatus = 'cancelled';
            }
        } else if (hasOtherActiveItems) {
            // Se há outros itens ativos, marcar como parcialmente cancelado
            newOrderStatus = 'partially_cancelled';
            if (order.paymentStatus === 'approved') {
                newPaymentStatus = 'partially_refunded';
            }
        } else {
            // Se todos os outros itens já estão cancelados ou entregues
            newOrderStatus = 'cancelled';
            if (order.paymentStatus === 'approved') {
                newPaymentStatus = 'refunded';
            }
        }

        // Atualizar em transação
        const transaction = await prisma.$transaction([
             // Atualizar status do pedido e pagamento
            prisma.order.update({
                where: { id: parseInt(orderID) },
                data: { 
                    status: newOrderStatus,
                    paymentStatus: newPaymentStatus
                }
            }),

            // Atualizar itens do vendedor para cancelados
            prisma.orderItem.updateMany({
                where: { 
                    orderID: parseInt(orderID),
                    game: {
                        sellerID: sellerID
                    },
                    status: { 
                        notIn: ['shipped', 'delivered'] // Só cancela itens que não foram enviados
                    }
                },
                data: { status: 'cancelled' }
            })
        ]);

        const updatedOrder = transaction[0];

        // Buscar o pedido atualizado com itens para retornar
        const finalOrder = await prisma.order.findUnique({
            where: { id: parseInt(orderID) },
            include: {
                items: {
                    include: {
                        game: {
                            select: {
                                id: true,
                                title: true,
                                sellerID: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({
            order: finalOrder,
            message: `Items cancelled successfully. Order status updated to: ${newOrderStatus}`
        });

        } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.shipOrderBySeller = async (req, res) => {
    try {
        const { orderID } = req.params;
        const sellerID = req.user.id;

        const order = await prisma.order.findFirst({
            where: {
                id: orderID,
                items: {
                    every: {
                        game: {
                            sellerID: sellerID
                        }
                    }
                }
            }
        });

        if (!order)
            return res.status(404).json({ message: "Request not found or you do not have permission" });

        if (order.status !== 'paid')
            return res.status(400).json({ message: "The order is not paid" });

        const updatedOrder = await prisma.order.update({
            where: { id: orderID },
            data: { status: 'shipped' },
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
};