const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { hashPassword } = require("./../utils/miscellaneous");
const { blacklist } = require("./authController");

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

exports.getDashboadInfo = async (req, res) => {
    try {
        // Dados gerais
        const [
            totalUsers,
            totalOrders,
            totalGames,
            revenue,
            pendingOrders,
            activeSellers,
            pendingSellerRequests,
            recentOrders,
            recentUsers,
            pendingSellersList,
            salesData,
            popularGames
        ] = await Promise.all([
            {
                "total":
                    await prisma.user.count({
                        where: { isDeleted: false }
                    }),
                "user":
                    await prisma.user.count({
                        where: { isDeleted: false, role: "user" }
                    }),
                "seller":
                    await prisma.user.count({
                        where: { isDeleted: false, role: "seller" }
                    }),
                "admin":
                    await prisma.user.count({
                        where: { isDeleted: false, role: "admin" }
                    }),
            },

            // Total de pedidos
            {
                "total": await prisma.order.count(),
                "cancelled": await prisma.order.count({ where: { items: { every: { status: "cancelled" } } } }),
                "delivered": await prisma.order.count({ where: { items: { every: { status: "delivered" } } } }),
                "pending": await prisma.order.count({ where: { items: { every: { OR: [{ status: "pending" }, { status: "processing" }, { status: "shipping" }] } } } }),
            },

            // Total de jogos ativos
            prisma.game.count({
                where: { deleted: false }
            }),


            {
                "delivered":
                    await prisma.orderItem.findMany({
                        where: { status: "delivered" },
                        select: { unitPrice: true, quantity: true },
                    }),

                "pending":
                    await prisma.orderItem.findMany({
                        where: {
                            OR: [
                                { status: "pending" },
                                { status: "shipped" },
                                { status: "confirmed" },
                                { status: "processing" },
                            ]
                        }
                    }),

                "cancelled":
                    await prisma.orderItem.findMany({
                        where: {
                            status: "cancelled",
                        }
                    }),
            },

            // Pedidos pendentes
            prisma.orderItem.count({
                where: {
                    OR: [
                        { status: 'pending' },
                        { paymentStatus: 'pending' }
                    ]
                }
            }),

            // Vendedores ativos
            prisma.user.count({
                where: {
                    role: 'seller',
                    isDeleted: false
                }
            }),

            // Solicitações pendentes para se tornar vendedor
            prisma.user.count({
                where: {
                    wantsToBeSeller: true,
                    role: 'user', // Apenas usuários que ainda não são vendedores
                    isDeleted: false
                }
            }),

            // Últimos 10 pedidos
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true }
                    },
                    items: {
                        include: {
                            game: {
                                select: { title: true }
                            }
                        }
                    }
                }
            }),

            // Últimos 10 usuários cadastrados
            prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                where: {
                    isDeleted: false
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    wantsToBeSeller: true,
                    createdAt: true,
                }
            }),

            // Lista de usuários que querem ser vendedores
            prisma.user.findMany({
                where: {
                    wantsToBeSeller: true,
                    role: 'user',
                    isDeleted: false
                },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    wantsToBeSeller: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),

            // Dados de vendas por período (últimos 30 dias)
            prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                },
                select: {
                    total: true,
                    createdAt: true
                }
            }),

            // Jogos mais vendidos
            prisma.orderItem.groupBy({
                by: ['gameID'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 10,
                where: {
                    paymentStatus: 'paid' // Apenas itens pagos
                }
            })
        ])

        // Processar dados de vendas para gráficos
        const dailySales = salesData.reduce((acc, order) => {
            const date = order.createdAt.toISOString().split('T')[0]
            acc[date] = (acc[date] || 0) + order.total
            return acc
        }, {})

        // Enriquecer dados dos jogos populares
        const popularGamesWithDetails = await Promise.all(
            popularGames.map(async (item) => {
                const game = await prisma.game.findUnique({
                    where: { id: item.gameID },
                    select: { title: true, price: true, seller: { select: { name: true } } }
                })
                return {
                    ...item,
                    gameTitle: game?.title,
                    sellerName: game?.seller.name,
                    revenue: item._sum.quantity * (game?.price || 0)
                }
            })
        )

        const dashboardStats = {
            summary: {
                totalUsers,
                totalOrders,
                totalGames,
                revenue: {
                    "delivered": revenue.delivered.reduce(
                        (acc, item) => acc + item.unitPrice * item.quantity, 0
                    ),
                    "pending": revenue.pending?.reduce(
                        (acc, item) => acc + item.unitPrice * item.quantity, 0
                    ),
                    "cancelled": revenue.cancelled?.reduce(
                        (acc, item) => acc + item.unitPrice * item.quantity, 0
                    ),
                },
                pendingOrders,
                activeSellers,
                pendingSellerRequests // Novo campo adicionado
            },
            recentActivity: {
                orders: recentOrders,
                users: recentUsers,
                pendingSellers: pendingSellersList // Novo campo adicionado
            },
            analytics: {
                dailySales,
                popularGames: popularGamesWithDetails
            }
        }

        res.status(200).json(dashboardStats)
    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}

exports.setUserToSeller = async (req, res) => {
    try {
        const userID = parseInt(req.params.userID);
        if (!req.body) req.body = {}
        const { state = true } = req.body;

        // Primeiro, busca o usuário para verificar o role atual
        const user = await prisma.user.findUnique({
            where: { id: userID },
        });

        if (!user)
            return res.status(404).json({ message: "Usuário não encontrado" });

        if (user.role === 'seller' || user.role === 'admin')
            return res.status(400).json({ message: "Usuário já tem um cargo atribuido" });

        // Atualiza o usuário para vendedor
        let updatedUser;

        if (state) {
            updatedUser = await prisma.user.update({
                where: { id: userID },
                data: { wantsToBeSeller: false, role: "seller" }
            });
        }
        else {
            updatedUser = await prisma.user.update({
                where: { id: userID },
                data: { wantsToBeSeller: false }
            });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Erro interno do servidor: ${error}` });
    }
}

exports.deleteUserByID = async (req, res) => {
    try {
        const userID = parseInt(req.params.userID);
        
        if (!userID)
            res.status(500).json({ message: "Informe o ID do usuário" });

        // Apaga as informações sensíveis do perfil do usuário
        const user = await prisma.user.update({
            where: { id: userID },
            data: {
                isDeleted: true,
                name: 'Usuário removido',
                email: `deleted-user-${userID}`,
                phone: "",
                CPF: `deleted-user-${userID}`,
                image: "uploads/games/default.png",
                password: await hashPassword(`deleted-user-${userID}`),
            }
        });

        // Apaga as informações sensíveis nos endereços do usuário
        const addresses = await prisma.address.updateMany({
            where: { userID: userID },
            data: {
                label: " ",
                street: " ",
                number: " ",
                complemento: " ",
                neighborhood: " ",
                zipCode: " ",
            }
        });

        res.status(200).json({ message: "Usuário deletado com sucesso" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.getOrders = async (req, res) => {
    try {

        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                address: true,
                shippingMethod: true,
                paymentMethod: true,
                coupon: true,
                items: {
                    include: {
                        game: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const formattedOrders = orders.map(order => ({
            ...order,
            status: getOrderStatusFromItems(order.items),
            paymentStatus: getPaymentStatusFromItems(order.items),

            externID: generateExternID(String(order.id)),
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

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
}

exports.confirmPayment = async (req, res) => {
  try {
    const { orderID } = req.params;
    
    // Verificar se o pedido existe
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderID) },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Atualizar os itens não cancelados
    await prisma.orderItem.updateMany({
      where: {
        orderID: parseInt(orderID),
        status: {
          not: 'cancelled'
        }
      },
      data: {
        paymentStatus: 'paid'
      }
    });

    // Recarregar o pedido com os itens atualizados
    const updatedOrder = await prisma.order.findUnique({
      where: { id: parseInt(orderID) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
        shippingMethod: true,
        paymentMethod: true,
        coupon: true,
        items: {
          include: {
            game: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};