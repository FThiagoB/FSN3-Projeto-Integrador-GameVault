const fs = require('fs');
const path = require('path');

const {generateFileHash, findExistingImage} = require("../utils/miscellaneous")
const downloadImageFromUrl = require('../utils/downloadImage');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Usado para verificar se há u
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

exports.deleteGame = async (req, res) => {
    try {
        const id_procurado = parseInt( req.params.id );

        const jogo_deletado = await prisma.game.delete({
            where:{
                id: id_procurado,
            },
        });

        res.status(200).json( jogo_deletado );
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ "message": e.message });
    }
    finally {
        await prisma.$disconnect();
    }
};

exports.infoGame = async (req, res) => {
    try {
        const id_procurado = parseInt( req.params.id );

        const jogo_encontrado = await prisma.game.findFirst({
            where:{
                id: id_procurado,
            },
        });

        if( !jogo_encontrado ){
            res.status(404).json({ message: "Jogo não encontrado" });
        }

        res.status(200).json( jogo_encontrado );
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ "message": e.message });
    }
    finally {
        await prisma.$disconnect();
    }
};


exports.updateGame = async (req, res) => {
    try {
        const id_jogo = parseInt( req.params.id );

        const new_title = req.body.title;
        const new_description = req.body.description;
        const new_price = parseFloat( req.body.price );
        const new_stock = parseInt( req.body.stock );
        const new_genre = req.body.genre;

        // O usuário pode especificar o link da imagem que se quer usar
        const imageURL = req.body.imageURL; 
        
        // Verifica se o estoque foi informado mas a conversão para int retornou NaN (erro na conversão) ou se for um número negativo
        if( req.body.stock && Number.isNaN( new_stock ) || (new_stock < 0) )
            return res.status(400).json({"message": "Requisição inválida: o estoque deve ser um número inteiro positivo."})

        // Verifica se o preço foi informado mas a conversão para float retornou NaN (erro na conversão) ou se for um número negativo
        if( req.body.price && Number.isNaN( new_price ) || (new_price <= 0) )
            return res.status(400).json({"message": "Requisição inválida: o preço deve ser um número positivo diferente de zero."})

        // Monta a query do prisma por meio de uma variável
        const query_prisma = {};
        query_prisma.where = { id: id_jogo };
        query_prisma.data = {};

        // Preenche a query de acordo com os campos informados na requisição (só precisa passar o que for mudar)
        if( req.body.title )                query_prisma.data.title = new_title;
        if( req.body.description )          query_prisma.data.description = new_description;
        if( req.body.price )                query_prisma.data.price = novo_preco;
        if( req.body.stock !== undefined )  query_prisma.data.stock = new_stock;
        if( req.body.genre )                query_prisma.data.genre = new_genre;

        // Foi especificado uma nova imagem
        if( imageURL || req.file ){
            // O ID do vendedor é usado para gerar o hash do nome da imagem
            const gameInfo = await prisma.game.findUnique({
                where: { id: id_jogo },
                select: { title: true, image: true, sellerID: true }
            })

            if( !gameInfo )
                throw new Error("Deu errado.");
            
            const image_title = generateFileHash(new_title || gameInfo.title, gameInfo.sellerID);
            const fileFolder = path.resolve(__dirname, '..', 'uploads', "games");
            let filename;

            try{
                if( req.file && req.file.buffer ){
                    const ext = path.extname(req.file.originalname);
                    filename = `${image_title}${ext}`;

                    const localFilePath = path.resolve(fileFolder, filename);
                    fs.writeFileSync(localFilePath, req.file.buffer);

                    relativeUploadPath = path.join('/uploads', "games", filename);
                }
                else{
                    const ext = path.extname(imageURL).split('?')[0] || '.jpg';
                    filename = `${image_title}${ext}`;

                    const localFilePath = path.resolve(fileFolder, filename);
                    downloadImageFromUrl(imageURL, localFilePath)

                    relativeUploadPath = path.join('/uploads', "games", filename);
                }

                query_prisma.data.image = filename;
            }
            catch( e ){
                return res.status(500).json({"message": e.message});
            }
        }

        const game = await prisma.game.update( query_prisma );
        res.status(200).json( game );
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ "message": e.message });
    }
    finally {
        await prisma.$disconnect();
    }
};

exports.createGame = async (req, res) => {
    try {
        // Campos usados diretamente no cadastro do jogo
        const title = req.body.title;
        const description = req.body.description;
        const price = parseFloat( req.body.price );
        const stock = parseInt( req.body.stock );
        const sellerID = req.body.seller;
        const genre = req.body.genre;

        // O usuário pode especificar o link da imagem que se quer usar
        const imageURL = req.body.imageURL; 

        // Verifica se todos os campos foram especificados
        if( !req.body.title || !req.body.description || !req.body.price || !req.body.seller || !req.body.genre || req.body.stock === undefined )
            return res.status(400).json({"message": "Requisição inválida: informe todos os campos necessários para o cadastro."})

        // Verifica se o estoque foi informado mas a conversão para int retornou NaN (erro na conversão) ou se for um número negativo
        if( req.body.stock && Number.isNaN( stock ) || (stock < 0) )
            return res.status(400).json({"message": "Requisição inválida: o estoque deve ser um número inteiro positivo."})

        // Verifica se o preço foi informado mas a conversão para float retornou NaN (erro na conversão) ou se for um número negativo
        if( req.body.price && Number.isNaN( price ) || (price <= 0) )
            return res.status(400).json({"message": "Requisição inválida: o preço deve ser um número positivo diferente de zero."})

        const prismaQuery = {
            data: {
                title: title,
                description: description,
                price: price,
                stock: stock,
                sellerID: sellerID,
                genre: genre
            }
        }

        // Verifica se a imagem foi especificada de alguma forma (url ou arquivo)
        if( imageURL || req.file ){
            const image_title = generateFileHash(title, sellerID);
            const fileFolder = path.resolve(__dirname, '..', 'uploads', "games");
            const existingFile = findExistingImage( image_title, fileFolder )
            let filename;

            // Verifica se o arquivo já existe
            if( !existingFile ){
                try{
                    if( req.file && req.file.buffer ){
                        const ext = path.extname(req.file.originalname);
                        filename = `${image_title}${ext}`;

                        const localFilePath = path.resolve(fileFolder, filename);
                        fs.writeFileSync(localFilePath, req.file.buffer);

                        relativeUploadPath = path.join('/uploads', "games", filename);
                    }
                    else{
                        const ext = path.extname(imageURL).split('?')[0] || '.jpg';
                        filename = `${image_title}${ext}`;

                        const localFilePath = path.resolve(fileFolder, filename);
                        downloadImageFromUrl(imageURL, localFilePath)

                        relativeUploadPath = path.join('/uploads', "games", filename);
                    }
                }
                catch( e ){
                    return res.status(500).json({"message": e.message});
                }
            }
            else{
                const ext = path.extname(existingFile);
                filename = `${image_title}${ext}`;
            }

            prismaQuery.data.image = filename;
        }
        
        
        const game = await prisma.game.create( prismaQuery);
        res.status(200).json( game );
    }
    catch (e) {
        console.log(e);

        switch(e.code){            
            // Problemas de restrição (id já existe ou problemas com o ID do vendedor)
            case "P2003":
                res.status(400).json({"message": `Violação de restrição ${e.meta.constraint} em ${e.meta.modelName}`});
                break;

            default:
                res.status(500).json({"message": e.message});
        }
    }
    finally {
        await prisma.$disconnect();
    }
};

exports.getGameImage = async (req, res) => {
    const imageName = req.params.image;
    const imagePath = path.resolve(__dirname, '..', 'uploads', 'games', imageName);

    // Verifica se o arquivo existe
    if (fs.existsSync(imagePath))
        res.sendFile(imagePath);
    else 
        res.status(404).json({ error: 'Imagem não encontrada.' });
};