const {hashPassword} = require("./../utils/miscellaneous");
const {blacklist} = require("./authController");

const { handleImageUpload } = require("../utils/imageHandler");

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
        console.error( error );
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
    const userID = parseInt(req.user.id);

    // Realiza a requisição
    const users = await prisma.game.findMany({
      where: {
        sellerID: userID
      },
      orderBy: {
        id: "asc"
      }
    });

    // Verifica se encontrou algum jogo
    if( !users )
      return res.status(404).json({message: "Users not found."});

    res.status(200).json( users );
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

exports.getGamesBySellerByID = async (req, res) => {
  try{
    const userID = parseInt(req.params.id);

    // Realiza a requisição
    const users = await prisma.game.findMany({
      where: {
        sellerID: userID
      },
      orderBy: {
        id: "asc"
      }
    });

    // Verifica se encontrou algum jogo
    if( !users )
      return res.status(404).json({message: "Users not found."});

    res.status(200).json( users );
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// Apagar um usuário pode causar inconsistência entre tabelas (jogos, compras, endereços), o que gera um erro
// Nesse caso se manteve o registro e apagou-se as informações sensíveis, mantendo a rastreabilidade e consistência
exports.deleteUserByID = async (req, res) => {
    try{
        const userID = parseInt(req.params.id);
        
        // Apaga as informações sensíveis do perfil do usuário
        const user = await prisma.user.update({
            where: { id: userID },
            data: {
                isDeleted: true,
                name: 'Usuário removido',          
                email: `deleted-user-${userID}`, 
                phone: "",
                CPF: '',
                image: "uploads/games/default.png",
                password: await hashPassword( `deleted-user-${userID}` ),
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
        
        res.status(200).json( user );
    }
    catch( error ){
        console.error( error );
        res.status(500).json({message: error.message});
    }
};

// Deleta um usuário via seu ID do JWT (requisição do usuário ou vendedor)
exports.deleteUserByJWT = async (req, res) => {
    try{
        const userID = parseInt(req.user.id);

        // Recupera o token
        const authorization = req.headers["authorization"];
        const token = authorization?.split(' ')[1]; // Remove a string "Bearer "

        // Apaga as informações sensíveis do perfil do usuário
        const user = await prisma.user.update({
            where: { id: userID },
            data: {
                isDeleted: true,
                name: 'Usuário removido',          
                email: `deleted-user-${userID}`, 
                phone: "",
                CPF: '',
                image: "uploads/games/default.png",
                password: await hashPassword( `deleted-user-${userID}` ),
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

        // Adiciona o JWT à lista negra (token se tornará inválido durante seu tempo de validade)
        blacklist.add( token );

        res.status(200).json({message: "User deleted successfully"});
    }
    catch( error ){
        console.error( error );
        res.status(500).json({message: error.message});
    }
};

exports.createUser = async (req, res) => {
    try{
        const allowedRoles = ["user", "seller"];

        // Campos usados diretamente no cadastro do jogo
        if(!req.body) req.body = {};

        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;

        // Verifica se todos os campos foram preenchidos
        if ( !email || !password || !role ){
            return res.status(400).json({
                message: "fill in all fields required for registration.",
            });
        }

        // Valida os campos 
        if( !allowedRoles.includes(role) ){
            return res.status(400).json({
                message: "The specified role is invalid",
            });
        }

        // Cria o usuário
        const user = await prisma.user.create({
            data: {
                email: email,
                password: await hashPassword(password),
                role: role,
            }
        })

        res.status(201).json( user );
    }
    catch( error ){
        console.error( error );

        switch (error.code) {
            // Restrição : Email escolhido já está em uso
            case "P2002":
                res.status(400).json({
                    message: `the desired email is already in use.`,
                });
                break;

            default:
                res.status(500).json({ message: error.message });
        }
    }
};

exports.updateUser = async (req, res) => {
    try{
        const userID = parseInt(req.user.id);
        let user;

        // Monta a query do prisma por meio de uma variável
        const query_prisma = {};
        query_prisma.where = { id: userID };
        query_prisma.data = {};

        // Obtém os campos passados que devem ser atualizados
        if(!req.body) req.body = {};

        const cpf = req.body.cpf;
        const name = req.body.name;
        const phone = req.body.phone;

        const email = req.body.email;
        const password = req.body.password;

        // Preenche a query de acordo com os campos informados na requisição (só precisa passar o que for mudar)
        if (req.body.cpf) query_prisma.data.CPF = cpf;
        if (req.body.name) query_prisma.data.name = name;
        if (req.body.phone) query_prisma.data.phone = phone;
        if (req.body.email) query_prisma.data.email = email;
        if (req.body.password) query_prisma.data.password = await hashPassword(password);

        user = await prisma.user.update(query_prisma);

        // Se a imagem foi passada, realiza o download e seta
        const filename = await handleImageUpload( req, userID, "user" )

        if( filename ){
            user = await prisma.user.update({
                where: { id: userID },
                data: { image: filename }
            });
        }

        res.status(200).json(user);
    }
    catch( error ){
        console.error( error );
        
        switch (error.code) {
            // Restrição : Email escolhido já está em uso
            case "P2002":
                res.status(400).json({
                    message: `the desired email is already in use.`,
                });
                break;

            default:
                res.status(500).json({ message: error.message });
        }
    }
};