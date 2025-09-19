const {hashPassword, comparePassword} = require("../utils/miscellaneous")
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SECRET_JWT_KEY = "57b9a0531894bc0f375ca77e731ad465c6bc5a5b";

exports.logging = async ( req, res ) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        // Verifica se os campos foram passados
        if( !email || !password ){
            return res.status(401).json({message: "Informe usuário e senha"});
        }

        // Obtém a senha do banco
        const hashedPassword = await prisma.user.find({
            where: {
                email: email
            },
            fields: {
                password: true,
                role: true
            }
        });

        const match = await comparePassword( password, hashPassword.password );

        if( !match ){
            return res.status(401).json({message: "usuário/senha incorretos."});
        }

        const token = jwt.sign({
            email: email,
            role: role
        }, SECRET_JWT_KEY, { expiresIn: "24h" });

        res.status(201).json({message: token});
    }
    catch( error ){
        console.error( error );
        return res.status(500).json({message: `Problemas ao efetuar login: ${error.message}`});
    }
}