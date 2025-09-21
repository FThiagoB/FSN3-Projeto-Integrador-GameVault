const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Por enquanto isso é fixo
const shippingMethods = [
    { id: 'standard', name: 'Entrega Padrão', cost: 10.00, deliveryDays: '5-7' },
    { id: 'express', name: 'Entrega Expressa', cost: 25.00, deliveryDays: '2-3' }
];

// Por enquanto isso é fixo
const paymentMethods = [
    { id: 'credit_card', name: 'Cartão de Crédito' },
];

// Por enquanto isso é fixo
const discountCoupons = [
  {"code": "VERAO10", "discount": 0.1},
  {"code": "PRIMEIRACOMPRA","discount": 0.15},
  {"code": "GAMER20","discount": 0.2},
  {"code": "FREEGAME5","discount": 0.05},
  {"code": "BLACKFRIDAY30","discount": 0.3}
];

exports.validateCoupon = async (req, res) => {
    try{
        if( !req.body ) req.body = {};
        const { code } = req.body;

        if(!code)
            return res.status(400).json({message: "Coupon code is missing"});

        const coupon = discountCoupons.find( (c) => c.code === code );
        if (!coupon)
            return res.status(404).json({message: "Invalid coupon code"});

        res.status(200).json( coupon );
    }
    catch( error ){
        console.error( error );
        res.status(500).json({message: error.message})
    }
}

exports.getCoupons = async (req, res) => {
    try{
        if(!discountCoupons)
            return res.status(404).json({message: "There are no valid coupons available."});

        res.status(200).json( discountCoupons );
    }
    catch( error ){
        console.error( error );
        res.status(500).json({message: error.message})
    }
}

exports.getCheckoutInfo = async (req, res) => {
    /*
        Serve para o frontend resgatar informações necessárias para exibir as opções de endereços (caso o usuário já tenha cadastrado), métodos de envio, 
       métodos de pagamento, e também para saber o que falta
    */
    try{
        const userID = parseInt( req.user.id );

        // Verifica se o usuário tem algum email cadastrado
        const addresses = await prisma.address.findMany({
            where: {
                userID: userID,
            }
        });

        res.status(200).json({
            user: {
                hasAddress: addresses.length > 0,
                addresses,
            },

            // Métodos de envio
            shippingMethods: [
                { id: 'standard', name: 'Padrão', cost: 10.00 },
                { id: 'express', name: 'Expresso', cost: 25.00 },
            ],

            // Métodos de pagamento
            paymentMethods: [
                { id: 'credit_card', name: 'Cartão de Crédito' },
            ],
        });
    }
    catch( error ){
        console.error( error );
        res.status(500).json({message: error.message})
    }
}

exports.processCheckout = async (req, res) => {
    try{
        if( !req.body ) req.body = {};
        const { shippingAddress, paymentMethod, shippingMethod, couponCode, items } = req.body;

        const userID = parseInt( req.user.id );
        let addressID;

        // Validar dados de entrada
        if( !shippingAddress || !paymentMethod || !shippingMethod )
            return res.status(400).json({message: "Specify all required fields"});

        if( shippingAddress && shippingAddress.newAddress ){
            const { street, number, complemento, neighborhood, city, state, zipCode } = shippingAddress.newAddress;
            if(!street || !number || !neighborhood || !city || !state || !zipCode)
                return res.status(400).json({message: "Invalid delivery address"});
        }

        if( !items || !Array.isArray(items) || items.length === 0 )
            return res.status(400).json({message: "Invalid product list"});

        
        // Criar transação para garantir atomicidade
        const result = await prisma.$transaction(async (prisma) => {
            // Campos para um novo endereço foram passados
            if (shippingAddress.newAddress) {
                // Verifica se o endereço já está no banco
                const existingAddress = await prisma.address.findFirst({
                    where: {
                        userID: userID,
                        zipCode: shippingAddress.newAddress.zipCode,
                        number: shippingAddress.newAddress.number
                    }
                });
                
                if(existingAddress)
                    addressID = existingAddress.id;

                else{
                    // Cria um novo endereço
                    const newAddress = await prisma.address.create({
                        data: {
                            userID: userID,
                            ...shippingAddress.newAddress // Desconstroi o objeto
                        }
                    });

                    addressID = newAddress.id;
                }
            }
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

            // Calcular subtotal e validar itens
            let subtotal = 0;
            const orderItems = [];

            for (const item of items) {
                const game = await prisma.game.findUnique({
                    where: { id: item.gameID },
                    select: { id: true, title: true, price: true, stock: true }
                });

                if(!game)
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

                // Atualizar estoque ( podemos esperar até que o status de pagamento mude para confirmado )
                // await prisma.game.update({
                //     where: { id: game.id },
                //     data: { stock: { decrement: item.quantity } }
                // });
            }

            // Calcular custos adicionais
            const selectedShipping = shippingMethods.find(m => m.id === shippingMethod);
            const couponApplied = discountCoupons.find(c => c.code === couponCode);
            const shippingCost = selectedShipping ? selectedShipping.cost : 0;
            const discountApplied = couponApplied ? couponApplied.discount : 0;

            const discount = subtotal * discountApplied;
            const tax = subtotal * 0.1; // 10% de imposto
            const total = subtotal + shippingCost + tax;

            // Criar pedido
            const order = await prisma.order.create({
                data: {
                    userID: userID,
                    shippingAddressID: addressID,
                    paymentMethod,
                    shippingMethod,
                    status: "pending",
                    paymentStatus: "pending",
                    subtotal,
                    shippingCost,
                    tax,
                    total,
                    discount,
                    items: {
                        create: orderItems
                    }
                }
            });

            return order;
        });

        res.status( 200 ).json( result );
    }
    catch( error ){
        console.error( error );
        res.status(500).json({message: error.message})
    }
}

exports.getTransactionsByJWT = async (req, res) => {
    try{
        const userID = parseInt( req.user.id );
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
                            select: {id: true, title: true, image: true}
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

        if( !orders || orders.length === 0 )
            return res.status(404).json({message: "Transactions not found"})

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
    catch( error ){
        console.error( error );
        res.status(500).json({message: error.message})
    }
}

exports.getTransactionsByID = async (req, res) => {
    try{
        const userID = parseInt( req.body.id );
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
                            select: {id: true, title: true, image: true}
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

        if( !orders || orders.length === 0 )
            return res.status(404).json({message: "Transactions not found"})

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
    catch( error ){
        console.error( error );
        res.status(500).json({message: error.message})
    }
}
