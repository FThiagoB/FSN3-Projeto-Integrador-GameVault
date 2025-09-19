const {hashPassword} = require("./../utils/miscellaneous");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
    try{
        const users = await prisma.user.findMany({
            orderBy: { id: "asc" }
        });

        res.status(200).json(users);
    }
    catch( error ){
        console.log( error );
        res.status(500).json({message: error.message});
    }
};

exports.getUserByID = async (req, res) => {
    try{
        const userID = parseInt(req.params.id);
        const queryPrisma = { where: {id: userID} };

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
        const userID = parseInt(req.user.id);
        const queryPrisma = { where: {id: userID} };

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

exports.getGamesBySeller = async (req, res) => {
  try{
    const userID = req.user.id;

    // Realiza a requisição
    const games = await prisma.game.findMany({
      where: {
        sellerID: userID
      },
      orderBy: {
        id: "asc"
      }
    });

    // Verifica se encontrou algum jogo
    if( !games )
      return res.status(404).json({message: "Games not found."});

    res.status(200).json( games );
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

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
        const userID = req.user.id;

        // Monta a query do prisma por meio de uma variável
        const query_prisma = {};
        query_prisma.where = { id: userID };
        query_prisma.data = {};

        if( req.body ){
            const cpf = req.body.cpf;
            const name = req.body.name;
            const phone = req.body.phone;
            const email = req.body.email;
            const password = req.body.password;

            // O usuário pode especificar o link da imagem que se quer usar
            const imageURL = req.body.imageURL;

            // Preenche a query de acordo com os campos informados na requisição (só precisa passar o que for mudar)
            if (req.body.cpf) query_prisma.data.CPF = cpf;
            if (req.body.name) query_prisma.data.name = name;
            if (req.body.phone) query_prisma.data.phone = phone;
            if (req.body.email) query_prisma.data.email = email;
            if (req.body.password) query_prisma.data.password = await hashPassword(password);

            // ToDo : Procedimento para mudar a imagem <- criar um middleware
        }

        const user = await prisma.user.update(query_prisma);
        res.status(200).json(user);
    }
    catch( error ){
        console.log( error );
        res.status(500).json({message: error.message});
    }
};