const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getGames = async (req, res) => {
    try {
        // Verifica se há queries na url
        const orderBy = req.query.orderby ? req.query.orderby : "asc";
        const search = req.query.search ? req.query.search : "";

        // Campos para paginação
        const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

        // Verifica quantos jogos deve ignoras
        const skip = (page - 1) * limit;

        // Retorna os registros em ordem crescente de ID
        const jogos = await prisma.game.findMany({
            // Ordem dos elementos
            orderBy: {
                id: orderBy,
            },

            // Filtro aplicado na procura
            where: {
                title: {
                    contains: search,
                    mode: 'insensitive' // Ignora maiúsculas/minúsculas
                }
            },

            // Quantid. de itens para pular e quantos incluir (usado na paginação)
            skip: skip,
            take: limit
        });

        // Verifica se não há elementos
        if( jogos.length === 0 ){
            return res.status(404).json({
                "message": "Jogos não encontrados."
            });
        }

        // Pega o total de jogos (utilizado na criação da paginação)
        const total = await prisma.game.count({
            where: {
                title: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        });

        // Retorna um objeto composto dos registros encontrados e informações par paginação, se houver
        res.status(200).json({
            "data": jogos,

            "pagination": {
                "page": page,
                "totalPages": Math.ceil( total / limit ),
            }

        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ "message": e.message });
    }
    finally {
        await prisma.$disconnect();
    }
};