const fs = require("fs");
const path = require("path");

const {hashPassword, comparePassword} = require("./../utils/miscellaneous");
const {blacklist} = require("./authController");
const { handleImageUpload } = require("../utils/imageHandler");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
    try{
        const users = await prisma.user.findMany({
            orderBy: { id: "asc" }
        });

        // Mapeia os resultados para adicionar a URL completa da imagem
        const usersWithImageUrl = users.map((user) => ({
            ...user,
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/users/${
                user.image
            }`,
        }));

        res.status(200).json(usersWithImageUrl);
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

        const userWithImageUrl = {
            ...filteredUser,
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/users/${
                user.image
            }`,
        };

        res.status(200).json( userWithImageUrl );
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

        const userWithImageUrl = {
            ...filteredUser,
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/users/${
                user.image
            }`,
        };

        res.status(200).json( userWithImageUrl );
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
    const games = await prisma.game.findMany({
      where: {
        sellerID: userID
      },
      orderBy: {
        id: "asc"
      }
    });

    // Verifica se encontrou algum jogo
    if( !games.length )
      return res.status(404).json({message: "Games not found."});

    // Mapeia os resultados para adicionar a URL completa da imagem
    const gamesWithImageUrl = games.map((game) => ({
        ...game,
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/games/${
            game.image
        }`,
    }));

    res.status(200).json( gamesWithImageUrl );
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
    const games = await prisma.game.findMany({
      where: {
        sellerID: userID
      },
      orderBy: {
        id: "asc"
      }
    });

    // Verifica se encontrou algum jogo
    if( !games.length )
      return res.status(404).json({message: "Games not found."});

    // Mapeia os resultados para adicionar a URL completa da imagem
    const gamesWithImageUrl = games.map((game) => ({
        ...game,
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/games/${
            game.image
        }`,
    }));

    res.status(200).json( gamesWithImageUrl );
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
                CPF: `deleted-user-${userID}`, 
                image: "default.png",
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
                CPF: `deleted-user-${userID}`, 
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
        const {email, password, role, phone = "", name = "", CPF = ""} = req.body;

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
        let hashedPassword = await hashPassword( password );
        const prismaData = {email, password: hashedPassword, role};
        if( phone ) prismaData.phone = phone;
        if( name ) prismaData.name = name;
        if( CPF ) prismaData.CPF = CPF;

        const user = await prisma.user.create({
            data: prismaData
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

exports.updateUserEmail = async (req, res) => {
    try{
        const userID = parseInt(req.user.id);

        if( !req.body ) req.body = {};
        const {current_password, new_email} = req.body;

        // Verifica se os campos foram passados
        if( !current_password ||  !new_email )
            return res.status(400).json({message: "Provide the necessary information."});

        // Obtém as informações atuais de usuários
        const current_user = await prisma.user.findUnique({ where: { id: userID } });

        // Verifica se a senha bate
        const match = await comparePassword( current_password, current_user.password );
        if( !match )
            return res.status(400).json({message: "The password is incorrect."});

        // Monta a query do prisma por meio de uma variável
        const user = await prisma.user.update({
            where: { id: userID },
            data: {email: new_email}
        });

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

exports.updateUserPassword = async (req, res) => {
    try{
        const userID = parseInt(req.user.id);

        if( !req.body ) req.body = {};
        const {current_password, new_password} = req.body;

        // Verifica se os campos foram passados
        if( !current_password ||  !new_password )
            return res.status(400).json({message: "Provide the necessary information."});

        // Obtém as informações atuais de usuários
        const current_user = await prisma.user.findUnique({ where: { id: userID } });

        // Verifica se a senha bate
        const match = await comparePassword( current_password, current_user.password );
        if( !match )
            return res.status(400).json({message: "The password is incorrect."});

        // Monta a query do prisma por meio de uma variável
        let hashedPassword = await hashPassword( new_password );
        const user = await prisma.user.update({
            where: { id: userID },
            data: {password: hashedPassword}
        });

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

exports.getUserImage = async (req, res) => {
  const imageName = req.params.image;
  const imagePath = path.resolve(
    __dirname,
    "..",
    "uploads",
    "users",
    imageName
  );

  // Verifica se o arquivo existe
  if (fs.existsSync(imagePath)) res.sendFile(imagePath);
  else res.status(404).json({ error: "Image not found." });
};

exports.removeUserPicture = async (req, res) => {
  try{
    const userID = parseInt(req.user.id);

    const user = await prisma.user.update({
        where: { id: userID },
        data: {
            image: "default.png",
        }
    });

    res.status(200).send();
  }
  catch( error ){
    console.error( error );
    res.status(500).json({message: error.message});
}
};