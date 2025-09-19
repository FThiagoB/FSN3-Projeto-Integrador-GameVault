const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
    try{
        const users = await prisma.user.findMany({
            orderBy: { CPF: "asc" }
        });

        res.status(200).json({message: users});
    }
    catch( error ){
        console.log( error );
        res.status(500).json({message: error.message});
    }
};

exports.getUserByID = async (req, res) => {
    try{
        const userID = req.params.id;
        const queryPrisma = { where: {CPF: userID} };

        // Realiza a requisição
        const user = await prisma.user.findUnique( queryPrisma );

        // Verifica se o usuário foi encontrado (apenas trata para o caso mas não deve acontecer, já que o id vem do JWT)
        if( !user )
            return res.status(404).json({message: "User not found."});

        // Remove o campo "password" da resposta
        const {password, ...filteredUser} = user;

        res.status(200).json( filteredUser );
    }
    catch( error ){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getUserByJWT = async (req, res) => {
    try{
        const userID = req.user.id;
        const queryPrisma = { where: {CPF: userID} };

        // Realiza a requisição
        const user = await prisma.user.findUnique( queryPrisma );

        // Verifica se o usuário foi encontrado (apenas trata para o caso mas não deve acontecer, já que o id vem do JWT)
        if( !user )
            return res.status(404).json({message: "User not found."});

        // Remove o campo "password" da resposta
        const {password, ...filteredUser} = user;
        res.status(200).json( filteredUser );
    }
    catch( error ){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserByID = async (req, res) => {
    try{
        res.status(501).json({});
    }
    catch( error ){
        console.log( error );
        res.status(500).json({message: error.message});
    }
};

exports.deleteUserByJWT = async (req, res) => {
    try{
        res.status(501).json({});
    }
    catch( error ){
        console.log( error );
        res.status(500).json({message: error.message});
    }
};

exports.createUser = async (req, res) => {
    try{
        res.status(501).json({});
    }
    catch( error ){
        console.log( error );
        res.status(500).json({message: error.message});
    }
};

exports.updateUser = async (req, res) => {
    try{
        res.status(501).json({});
    }
    catch( error ){
        console.log( error );
        res.status(500).json({message: error.message});
    }
};