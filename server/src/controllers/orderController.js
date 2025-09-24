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

    const totalItems = items.length;

    const statusCounts = items.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {});

    // Status finais (todos os itens com mesmo estado)
    if (statusCounts['cancelled'] === totalItems) return 'cancelled';
    if (statusCounts['delivered'] === totalItems) return 'delivered';
    if (statusCounts['shipped'] === totalItems) return 'shipped';
    if (statusCounts['confirmed'] === totalItems) return 'confirmed';
    if (statusCounts['pending'] === totalItems) return 'pending';

    // Pedido foi concluído mas há diferentes status
    if (((statusCounts['delivered'] || 0) + (statusCounts['cancelled'] || 0)) === totalItems)
        return 'completed'; // Todos entregues ou cancelados (pedido finalizado)

    // Status intermediários por prioridade
    if (statusCounts['shipped'] > 0) return 'shipping';
    if (statusCounts['confirmed'] > 0) return 'processing';
    if (statusCounts['cancelled'] > 0) return 'partially_cancelled';

    return 'pending';
}

function getPaymentStatusFromItems(items) {
    const statusCounts = items.reduce((acc, item) => {
        acc[item.paymentStatus] = (acc[item.paymentStatus] || 0) + 1;
        return acc;
    }, {});

    const totalItems = items.length;

    // Se todos os itens estão pendentes ou cancelados (não houve pagamento)
    if ((statusCounts['pending'] || 0) === totalItems)
        return 'pending';

    // Se todos os itens estão cancelados
    if ((statusCounts['cancelled'] || 0) === totalItems)
        return 'cancelled';

    // Se todos os itens estão reembolsados ou cancelados (após pagamento)
    if ((statusCounts['refunded'] || 0) + (statusCounts['cancelled'] || 0) === totalItems)
        return 'refunded';

    // Se há algum item pago e algum reembolsado
    if (statusCounts['paid'] && statusCounts['refunded'])
        return 'partially_refunded';

    // Se há itens pagos e não há reembolsos, então está pago
    if (statusCounts['paid'] && !statusCounts['refunded'])
        return 'paid';

    return 'pending';
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
            return res.status(400).json({ message: "Especifique todos os campos" });

        if (shippingAddress) {
            const { street, number, complemento, neighborhood, city, state, zipCode } = shippingAddress;
            if (!street || !number || !neighborhood || !city || !state || !zipCode)
                return res.status(400).json({ message: "Endereço de entrega inválido" });
        }

        if (!items || !Array.isArray(items) || items.length === 0)
            return res.status(400).json({ message: "Lista de produtos inválida" });

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
            // Address: procura algum endereço válido do usuário
            else {
                const existingAddress = await prisma.address.findFirst({
                    where: {
                        id: shippingAddress.id,
                        userID: userID
                    }
                });

                if (!existingAddress)
                    throw new Error('Não foi possível encontrar nenhum endereço de entrega');

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
                    where: { id: item.id, deleted: false },
                    select: { id: true, title: true, price: true, stock: true }
                });

                if (!game)
                    throw new Error(`O jogo "${item.title}" não foi encontrado.`);

                if (game.stock < item.quantity)
                    throw new Error(`Estoque insuficiente para o jogo "${game.title}"`);

                const itemTotal = game.price * item.quantity;
                subtotal += itemTotal;

                // Armazena a informação bruta para montar os itens do pedido
                orderItems.push({
                    gameID: game.id,
                    quantity: item.quantity,
                    unitPrice: game.price,
                    status: "pending",
                    paymentStatus: "pending"
                });
            }

            // --- Frete ---
            const selectedShipping = await prisma.shippingMethod.findUnique({
                where: { id: shippingMethod.id },
            });
            if (!selectedShipping || !selectedShipping.isActive) {
                throw new Error("Método de envio inválido");
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

                if (!coupon) throw new Error("Cupom especificado é inválido ou inexistente");

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
                        paymentStatus: true
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
            status: getOrderStatusFromItems(order.items),
            paymentStatus: getPaymentStatusFromItems(order.items),

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
                        paymentStatus: true,
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
            return res.status(404).json({ message: "Pedidos não encontrados" });

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
                paymentStatus: getPaymentStatusFromItems(order.items),
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

        // Verificar se o orderID é um número
        if (Number.isNaN(parseInt(orderID)))
            return res.status(400).json({ message: "O número de ID do pedido deve ser inteiro" });

        // Procura o pedido no banco
        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderID), userID },
            include: {
                items: {
                    include: {
                        game: {
                            select: {
                                id: true,
                                sellerID: true,
                            },
                        }
                    }
                }
            }
        });

        // Existe?
        if (!order)
            return res.status(404).json({ message: "Pedido não encontrado" });

        // Verifica se pod cancelar o pedido
        let canCancel = true
        for (const item of order.items) {
            if (item.status == "delivered" || item.status == "shipped")
                canCancel = false;
        }

        if (!canCancel)
            return res.status(400).json({ message: "Pedido não pode ser cancelado" });

        // Atualiza o status de cada pedido
        for (const item of order.items) {
            if (item.status !== 'cancelled') {
                let paymentStatus = item.paymentStatus;

                // Se o item foi pago, marca como reembolsado; senão, marca como cancelado (pagamento)
                if (item.paymentStatus === 'paid')
                    paymentStatus = 'refunded';

                else if (item.paymentStatus === 'pending')
                    paymentStatus = 'cancelled';

                // Marca como cancelado
                await prisma.orderItem.update({
                    where: { id: item.id },
                    data: {
                        status: 'cancelled',
                        paymentStatus: paymentStatus
                    }
                });

                // Incrementa o estoque novamento
                await prisma.game.update({
                    where: { id: item.game.id },
                    data: { stock: { increment: item.quantity } },
                });
            }
        }

        res.status(200).json({ message: "Pedido cancelado" });
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
            return res.status(400).json({ message: "Problemas com a requisição" });

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
            return res.status(400).json({ message: "ID do pedido é necessário" });

        // Verificar se orderID é um número válido
        if (Number.isNaN(parseInt(orderID)))
            return res.status(400).json({ message: "ID do pedido deve ser inteiro" });

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
                                title: true,
                            },
                        }
                    }
                }
            }
        });

        if (!order)
            return res.status(404).json({ message: "Pedido não encontrado" });

        // Separar itens do vendedor e de outros vendedores
        const sellerItems = order.items.filter(item => item.game.sellerID === sellerID);
        const otherItems = order.items.filter(item => item.game.sellerID !== sellerID);

        if (sellerItems.length === 0)
            return res.status(404).json({ message: "Este vendedor não possui itens nesse pedido" });

        // Atualizar itens do vendedor: cancelar e reembolsar se pago
        for (const item of sellerItems) {
            // Só cancela itens que não foram enviados ou entregues
            if (item.status !== 'shipped' && item.status !== 'delivered') {
                let paymentStatus = item.paymentStatus;

                // Se o item foi pago, marca como reembolsado; senão, marca como cancelado (pagamento)
                if (item.paymentStatus === 'paid')
                    paymentStatus = 'refunded';

                else if (item.paymentStatus === 'pending')
                    paymentStatus = 'cancelled';

                await prisma.orderItem.update({
                    where: { id: item.id },
                    data: {
                        status: 'cancelled',
                        paymentStatus: paymentStatus
                    }
                });

                // Incrementa o estoque novamento
                await prisma.game.update({
                    where: { id: item.game.id },
                    data: { stock: { increment: item.quantity } },
                });
            }
        }

        res.status(200).json({ message: "Itens cancelados com sucesso." });

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