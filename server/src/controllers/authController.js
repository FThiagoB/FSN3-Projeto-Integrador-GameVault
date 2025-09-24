const { hashPassword, comparePassword } = require("../utils/miscellaneous");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SECRET_JWT_KEY = "57b9a0531894bc0f375ca77e731ad465c6bc5a5b";

// Lista com os tokens de usuários que fizeram logout
const blacklistedTokens = new Set();

function deleteToken(token) {
  const decoded = jwt.decode(token);
  blacklistedTokens.add(token);

  setTimeout(() => {
    blacklistedTokens.delete(token);
  }, decoded.exp * 1000 - Date.now());
}

function hasToken(token) {
  return blacklistedTokens.has(token);
}

exports.login = async (req, res) => {
  try {
    const email = req.body?.email;
    const password = req.body?.password;

    // Verifica se os campos foram passados
    if (!email || !password) {
      return res.status(400).json({ message: "Informe email e senha" });
    }

    // Obtém a senha do banco
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        password: true,
        role: true,
        id: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "email/senha inválidos." });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "email/senha inválidos." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      SECRET_JWT_KEY,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token: token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Problemas com o login: ${error.message}` });
  }
};

exports.logout = async (req, res) => {
  try {
    const authorization = req.headers["authorization"];
    const token = authorization?.split(" ")[1]; // Remove a string "Bearer "

    if (!token) return res.status(403).json({ message: "É necessário informar o token" });

    deleteToken(token);
    res.status(200).json({ message: "Sessão encerrada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error });
    deleteToken(token);
  }
};

// Middleware para validar o token JWT (usado nas rotas que necessitam de autenticação)
exports.auth = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];
    const token = authorization?.split(" ")[1]; // Remove a string "Bearer "

    if (!token) return res.status(403).json({ message: "É necessário informar o token" });

    // Usa o verify síncrono, que lança erro se inválido
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_JWT_KEY);
    } catch (err) {
      return res.status(403).json({ message: "Token inválido" });
    }

    // Checa se o ID existe no token
    if (!decoded)
      return res.status(403).json({ message: "Problemas com o payload do token" });

    // Busca o usuário no banco
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ message: "Usuário não existe" });

    req.user = user; // passa adiante
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Exporta as funções para manipular a blacklist
exports.blacklist = {
  add: deleteToken,
  has: hasToken,
};

// Middleware que facilita a verificação da autorização das rotas
exports.sellerOnly = async (req, res, next) => {
  const { id, role } = req.user;

  if (!role) return res.status(403).json({ message: "Informações sobre permissões não encontradas" });

  if (role !== "seller" && role !== "admin")
    return res.status(403).json({ message: "Usuário não tem autorização" });

  next();
};

exports.clientOnly = async (req, res, next) => {
  const { id, role } = req.user;

  if (!role) return res.status(403).json({ message: "Informações sobre permissões não encontradas" });

  if (role !== "user") return res.status(403).json({ message: "Usuário inválido" });

  next();
};

exports.adminOnly = async (req, res, next) => {
  const { id, role } = req.user;

  if (!role) return res.status(403).json({ message: "Informações sobre permissões não encontradas" });

  if (role !== "admin")
    return res.status(403).json({ message: "Usuário não tem autorização" });

  next();
};

// Lida com rotas que podem ser acessadas por usuários cadastrados ou não
exports.optionalAuth = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization?.split(" ")[1];
  
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return next();

    req.user = user;
    next();
  } catch (error) {
    next();
  }
};