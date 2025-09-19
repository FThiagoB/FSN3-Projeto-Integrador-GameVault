const { Router } = require("express");

const {authVerifyToken, authorization} = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = Router();

// Lista de usuários cadastrados no sistema
router.get("/users", userController.getUsers);          // Liberada por enquanto, mas é uma rota apenas para o admin

// Informações sobre um usuário específico
router.get("/users/:id", userController.getUserByID);   // Liberada por enquanto, mas é uma rota apenas para o admin

// Obtém as próprias informações via id do token JWT
router.get("/user", authVerifyToken, userController.getUserByJWT); // Retorna as informações do usuário do JWT 

// Atualiza as informações do usuário via id do token JWT
router.put("/user", authVerifyToken, userController.updateUser);

// Obtém informações sobre os jogos vendidos por um vendedor
router.get("/seller/games", authVerifyToken, authorization["onlySellers"], userController.getGamesBySeller);

module.exports = router;