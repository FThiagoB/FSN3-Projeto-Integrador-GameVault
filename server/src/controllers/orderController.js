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
                    unitPrice: game.price
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
                    include: {
                        game: {
                            select: { id: true, title: true, image: true }
                        }
                    }
                },
                address: {
                    select: {
                        label: true, street: true, number: true,
                        neighborhood: true, city: true, state: true,
                        zipCode: true
                    }
                }
            }
        })

        if (!orders || orders.length === 0)
            return res.status(404).json({ message: "Transactions not found" })

        res.status(200).json({
            orders,
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

exports.getTransactionByJWT = async (req, res) => {
    try {
        const userID = parseInt(req.user.orderID);
        const transactionID = parseInt(req.params.id);

        // filtro
        const where = {
            id_userID: {
                userID: userID,
                id: transactionID
            }
        };

        // Pega as informações dos pedidos
        const order = await prisma.order.findUnique({
            where,
            include: {
                items: {
                    include: {
                        game: {
                            select: { id: true, title: true, image: true }
                        }
                    }
                },
                address: {
                    select: {
                        label: true, street: true, number: true,
                        neighborhood: true, city: true, state: true,
                        zipCode: true
                    }
                }
            }
        })

        if (!order)
            return res.status(404).json({ message: "Transactions not found" })

        res.status(200).json(
            order
        )
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.getTransactionsByUserID = async (req, res) => {
    try {
        const userID = parseInt(req.params.id);
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
                    include: {
                        game: {
                            select: { id: true, title: true, image: true }
                        }
                    }
                },
                address: {
                    select: {
                        label: true, street: true, number: true,
                        neighborhood: true, city: true, state: true,
                        zipCode: true
                    }
                }
            }
        })

        if (!orders || orders.length === 0)
            return res.status(404).json({ message: "Transactions not found" })

        res.status(200).json({
            orders,
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

exports.getTransactionByUserID = async (req, res) => {
    try {
        const userID = parseInt(req.params.id);
        const transactionID = parseInt(req.params.orderID);

        // filtro
        const where = {
            id_userID: {
                userID: userID,
                id: transactionID
            }
        };

        // Pega as informações dos pedidos
        const order = await prisma.order.findUnique({
            where,
            include: {
                items: {
                    include: {
                        game: {
                            select: { id: true, title: true, image: true }
                        }
                    }
                },
                address: {
                    select: {
                        label: true, street: true, number: true,
                        neighborhood: true, city: true, state: true,
                        zipCode: true
                    }
                }
            }
        })

        if (!order)
            return res.status(404).json({ message: "Transactions not found" })

        res.status(200).json(
            order
        )
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        // filtro
        const where = {};
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
                    include: {
                        game: {
                            select: { id: true, title: true, image: true }
                        }
                    }
                },
                address: {
                    select: {
                        label: true, street: true, number: true,
                        neighborhood: true, city: true, state: true,
                        zipCode: true
                    }
                }
            }
        })

        if (!orders || orders.length === 0)
            return res.status(404).json({ message: "Transactions not found" })

        res.status(200).json({
            orders,
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
        const { page = 1, limit = 10, status, startDate, endDate } = req.query;
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

        if (status) where.status = status;

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
                    include: {
                        game: {
                            select: {
                                id: true,
                                title: true,
                                image: true,
                                price: true,
                                sellerID: true
                            }
                        }
                    }
                }
            },
        });

        if (!orders || !orders.length)
            return res.status(404).json({ message: "Transactions not found" });

        // Contar total de pedidos para paginação
        const totalOrders = await prisma.order.count({ where });

        // Formatar resposta para incluir informações do vendedor
        const formattedOrders = orders.map(order => {
            // Calcular totais apenas para os itens do vendedor
            const sellerItems = order.items.filter(item => item.game.sellerID === sellerId);
            const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

            return {
                id: order.id,
                status: order.status,
                paymentStatus: order.paymentStatus,
                sellerSubtotal,
                shippingCost: order.shippingCost,
                tax: order.tax,
                total: order.total,
                discount: order.discount,
                shippingMethod: order.shippingMethod,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
                buyer: order.user,
                shippingAddress: order.address,
                items: sellerItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    game: item.game
                }))
            };
        });

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

exports.getTransactionBySellerJWT = async (req, res) => {
    try {
        const sellerId = parseInt(req.user.id);
        const orderID = parseInt(req.params.orderID);

        // Monta os filtros
        const where = {
            id: orderID,
            items: {
                some: {
                    game: {
                        sellerID: sellerId
                    }
                }
            }
        };

        // Buscar pedidos onde o vendedor tem jogos
        const order = await prisma.order.findUnique({
            where,
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
                    include: {
                        game: {
                            select: {
                                id: true,
                                title: true,
                                image: true,
                                price: true,
                                sellerID: true
                            }
                        }
                    }
                }
            },
        });

        if (!order)
            return res.status(404).json({ message: "Transaction not found" });

        // Calcular totais apenas para os itens do vendedor
        const sellerItems = order.items.filter(item => item.game.sellerID === sellerId);
        const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

        const formattedOrder = {
            id: order.id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            sellerSubtotal,
            shippingCost: order.shippingCost,
            tax: order.tax,
            total: order.total,
            discount: order.discount,
            shippingMethod: order.shippingMethod,
            paymentMethod: order.paymentMethod,
            createdAt: order.createdAt,
            buyer: order.user,
            shippingAddress: order.address,
            items: sellerItems.map(item => ({
                id: item.id,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                game: item.game
            }))
        };

        res.status(200).json(formattedOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.getTransactionsBySellerID = async (req, res) => {
    try {
        const sellerId = parseInt(req.params.id);
        const { page = 1, limit = 10, status, startDate, endDate } = req.query;
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

        if (status) where.status = status;

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
                    include: {
                        game: {
                            select: {
                                id: true,
                                title: true,
                                image: true,
                                price: true,
                                sellerID: true
                            }
                        }
                    }
                }
            },
        });

        if (!orders || !orders.length)
            return res.status(404).json({ message: "Transactions not found" });

        // Contar total de pedidos para paginação
        const totalOrders = await prisma.order.count({ where });

        // Formatar resposta para incluir informações do vendedor
        const formattedOrders = orders.map(order => {
            // Calcular totais apenas para os itens do vendedor
            const sellerItems = order.items.filter(item => item.game.sellerID === sellerId);
            const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

            return {
                id: order.id,
                status: order.status,
                paymentStatus: order.paymentStatus,
                sellerSubtotal,
                shippingCost: order.shippingCost,
                tax: order.tax,
                total: order.total,
                discount: order.discount,
                shippingMethod: order.shippingMethod,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
                buyer: order.user,
                shippingAddress: order.address,
                items: sellerItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    game: item.game
                }))
            };
        });

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

exports.getTransactionBySellerID = async (req, res) => {
    try {
        const sellerId = parseInt(req.params.id);
        const orderID = parseInt(req.params.orderID);

        // Monta os filtros
        const where = {
            id: orderID,
            items: {
                some: {
                    game: {
                        sellerID: sellerId
                    }
                }
            }
        };

        // Buscar pedidos onde o vendedor tem jogos
        const order = await prisma.order.findUnique({
            where,
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
                    include: {
                        game: {
                            select: {
                                id: true,
                                title: true,
                                image: true,
                                price: true,
                                sellerID: true
                            }
                        }
                    }
                }
            },
        });

        if (!order)
            return res.status(404).json({ message: "Transaction not found" });

        // Calcular totais apenas para os itens do vendedor
        const sellerItems = order.items.filter(item => item.game.sellerID === sellerId);
        const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

        const formattedOrder = {
            id: order.id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            sellerSubtotal,
            shippingCost: order.shippingCost,
            tax: order.tax,
            total: order.total,
            discount: order.discount,
            shippingMethod: order.shippingMethod,
            paymentMethod: order.paymentMethod,
            createdAt: order.createdAt,
            buyer: order.user,
            shippingAddress: order.address,
            items: sellerItems.map(item => ({
                id: item.id,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                game: item.game
            }))
        };

        res.status(200).json(formattedOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.getSummaryBySellerJWT = async (req, res) => {
    try {
        const sellerID = parseInt(req.user.id);
        const { startDate, endDate } = req.query;

        // Filtros de data
        const dateFilter = {};
        if (startDate) dateFilter.gte = new Date(startDate);
        if (endDate) dateFilter.lte = new Date(endDate);

        // Define as condições para uma venda completa
        const completedPaidCondition = {
            game: { sellerID: sellerID },
            order: {
                status: 'completed',
                paymentStatus: 'paid',
                createdAt: dateFilter
            }
        };

        // Condições para vendas pendentes
        const pendingCondition = {
            game: { sellerID: sellerID },
            order: {
                OR: [
                    { paymentStatus: 'pending' },
                    { paymentStatus: 'paid', status: { not: 'completed' } }
                ],
                status: { not: 'cancelled' },
                createdAt: dateFilter
            }
        };

        // Executar agregações em paralelo
        const [salesStats, pendingSalesStats, ordersByStatus] = await Promise.all([
            // Vendas recebidas
            prisma.orderItem.aggregate({
                where: completedPaidCondition,
                _sum: {
                    quantity: true,
                    unitPrice: true
                },
                _count: {
                    id: true
                }
            }),

            // Vendas pendentes
            prisma.orderItem.aggregate({
                where: pendingCondition,
                _sum: {
                    quantity: true,
                    unitPrice: true
                },
                _count: {
                    id: true
                }
            }),

            // Pedidos por status
            prisma.order.groupBy({
                by: ['status'],
                where: {
                    items: {
                        some: {
                            game: {
                                sellerID: sellerID
                            }
                        }
                    },
                    createdAt: dateFilter
                },
                _count: {
                    id: true
                }
            })
        ]);

        // Calcular totais
        const totalSales = salesStats._sum.unitPrice * salesStats._sum.quantity || 0;
        const totalPendingSales = pendingSalesStats._sum.unitPrice * pendingSalesStats._sum.quantity || 0;

        // Formatar pedidos por status
        const ordersStatusSummary = {};
        ordersByStatus.forEach(item => {
            ordersStatusSummary[item.status] = item._count.id;
        });

        // Buscar pedidos recentes (apenas concluídos e pagos)
        const recentOrders = await prisma.order.findMany({
            where: {
                items: {
                    some: {
                        game: {
                            sellerID: sellerID
                        }
                    }
                },
                status: 'completed',
                paymentStatus: 'paid',
                createdAt: dateFilter
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                items: {
                    where: {
                        game: {
                            sellerID: sellerID
                        }
                    },
                    include: {
                        game: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
        });

        // Buscar jogos mais vendidos (apenas concluídos e pagos)
        const topSellingGames = await prisma.orderItem.groupBy({
            by: ['gameID'],
            where: completedPaidCondition,
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        });

        // Adicionar informações dos jogos
        const topSellingGamesWithDetails = await Promise.all(
            topSellingGames.map(async (item) => {
                const game = await prisma.game.findUnique({
                    where: { id: item.gameID },
                    select: {
                        title: true,
                        image: true
                    }
                });

                return {
                    gameID: item.gameID,
                    title: game.title,
                    image: game.image,
                    quantitySold: item._sum.quantity
                };
            })
        );


        res.status(200).json({
            summary: {
                totalSales,                                                 // vendas recebidas
                totalPendingSales,                                          // vendas pendentes
                totalItemsSold: salesStats._sum.quantity || 0,              // itens vendidos (recebidos)
                totalPendingItems: pendingSalesStats._sum.quantity || 0,    // itens pendentes
                totalOrders: salesStats._count.id || 0,                     // pedidos recebidos (concluídos e pagos)
                totalPendingOrders: pendingSalesStats._count.id || 0,       // pedidos pendentes
                ordersByStatus: ordersStatusSummary                         // contagem de pedidos por status
            },
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                total: order.total,
                createdAt: order.createdAt,
                buyer: order.user.name,
                items: order.items.map(item => ({
                    title: item.game.title,
                    quantity: item.quantity
                }))
            })),
            topSellingGames: topSellingGamesWithDetails
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}

exports.getSummaryBySellerID = async (req, res) => {
    try {
        const sellerID = parseInt(req.params.id);
        const { startDate, endDate } = req.query;

        // Filtros de data
        const dateFilter = {};
        if (startDate) dateFilter.gte = new Date(startDate);
        if (endDate) dateFilter.lte = new Date(endDate);

        // Define as condições para uma venda completa
        const completedPaidCondition = {
            game: { sellerID: sellerID },
            order: {
                status: 'completed',
                paymentStatus: 'paid',
                createdAt: dateFilter
            }
        };

        // Condições para vendas pendentes
        const pendingCondition = {
            game: { sellerID: sellerID },
            order: {
                OR: [
                    { paymentStatus: 'pending' },
                    { paymentStatus: 'paid', status: { not: 'completed' } }
                ],
                status: { not: 'cancelled' },
                createdAt: dateFilter
            }
        };

        // Verifica se o usuário especificado existe
        const seller = await prisma.user.findUnique({ where: { id: sellerID, role: "seller" } });
        if (!seller)
            res.status(404).json({ message: "Seller not found" })

        // Executar agregações em paralelo
        const [salesStats, pendingSalesStats, ordersByStatus] = await Promise.all([
            // Vendas recebidas
            prisma.orderItem.aggregate({
                where: completedPaidCondition,
                _sum: {
                    quantity: true,
                    unitPrice: true
                },
                _count: {
                    id: true
                }
            }),

            // Vendas pendentes
            prisma.orderItem.aggregate({
                where: pendingCondition,
                _sum: {
                    quantity: true,
                    unitPrice: true
                },
                _count: {
                    id: true
                }
            }),

            // Pedidos por status
            prisma.order.groupBy({
                by: ['status'],
                where: {
                    items: {
                        some: {
                            game: {
                                sellerID: sellerID
                            }
                        }
                    },
                    createdAt: dateFilter
                },
                _count: {
                    id: true
                }
            })
        ]);

        // Calcular totais
        const totalSales = salesStats._sum.unitPrice * salesStats._sum.quantity || 0;
        const totalPendingSales = pendingSalesStats._sum.unitPrice * pendingSalesStats._sum.quantity || 0;

        // Formatar pedidos por status
        const ordersStatusSummary = {};
        ordersByStatus.forEach(item => {
            ordersStatusSummary[item.status] = item._count.id;
        });

        // Buscar pedidos recentes (apenas concluídos e pagos)
        const recentOrders = await prisma.order.findMany({
            where: {
                items: {
                    some: {
                        game: {
                            sellerID: sellerID
                        }
                    }
                },
                status: 'completed',
                paymentStatus: 'paid',
                createdAt: dateFilter
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                items: {
                    where: {
                        game: {
                            sellerID: sellerID
                        }
                    },
                    include: {
                        game: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
        });

        // Buscar jogos mais vendidos (apenas concluídos e pagos)
        const topSellingGames = await prisma.orderItem.groupBy({
            by: ['gameID'],
            where: completedPaidCondition,
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        });

        // Adicionar informações dos jogos
        const topSellingGamesWithDetails = await Promise.all(
            topSellingGames.map(async (item) => {
                const game = await prisma.game.findUnique({
                    where: { id: item.gameID },
                    select: {
                        title: true,
                        image: true
                    }
                });

                return {
                    gameID: item.gameID,
                    title: game.title,
                    image: game.image,
                    quantitySold: item._sum.quantity
                };
            })
        );


        res.status(200).json({
            summary: {
                totalSales,                                                 // vendas recebidas
                totalPendingSales,                                          // vendas pendentes
                totalItemsSold: salesStats._sum.quantity || 0,              // itens vendidos (recebidos)
                totalPendingItems: pendingSalesStats._sum.quantity || 0,    // itens pendentes
                totalOrders: salesStats._count.id || 0,                     // pedidos recebidos (concluídos e pagos)
                totalPendingOrders: pendingSalesStats._count.id || 0,       // pedidos pendentes
                ordersByStatus: ordersStatusSummary                         // contagem de pedidos por status
            },
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                total: order.total,
                createdAt: order.createdAt,
                buyer: order.user.name,
                items: order.items.map(item => ({
                    title: item.game.title,
                    quantity: item.quantity
                }))
            })),
            topSellingGames: topSellingGamesWithDetails
        })
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

exports.receivedOrderByClient = async (req, res) => {
    try {
        const { orderID } = req.params;
        const userID = parseInt(req.user.id);

        const order = await prisma.order.findUnique({
            where: { id: orderID, userID },
        });

        if (!order)
            return res.status(404).json({ message: "Order not found" });

        if (order.status !== 'shipped')
            return res.status(400).json({ message: "The order has not yet been shipped" });

        const updatedOrder = await prisma.order.update({
            where: { id: orderID },
            data: { status: 'delivered' },
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
};

exports.cancelOrderBySeller = async (req, res) => {
    try {
        const { orderID } = req.params;
        const sellerID = req.user.id;

        // Verificar se o pedido existe e todos os itens são do vendedor
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
            return res.status(404).json({ message: "Order not found or you do not have permission" });

        if (!['pending', 'paid'].includes(order.status))
            return res.status(400).json({ message: "The order cannot be canceled in the current status." });

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

exports.updateOrderStatusByAdmin = async (req, res) => {
    try {
        const { orderID } = req.params;
        const { status, paymentStatus } = req.body;

        // Valida se os status são permitidos
        if (!allowedStatus.includes(status))
            return res.status(400).json({ message: "Invalid order status" });

        if (!allowedPaymentStatus.includes(paymentStatus))
            return res.status(400).json({ error: 'Invalid payment status.' });

        const order = await prisma.order.findUnique({
            where: { id: orderID },
        });

        if (!order)
            return res.status(404).json({ message: "Order not found" });

        const updatedOrder = await prisma.order.update({
            where: { id: orderID },
            data: { status, paymentStatus },
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
};