const { Router } = require("express");

const {authVerifyToken, authorization} = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = Router();

// Rotas para o admin ====================================================================
router.get("/users", authVerifyToken, authorization["onlyAdmin"], userController.getUsers); // Lista de todos os usuários cadastrados no sistema
router.get("/users/:id", authVerifyToken, authorization["onlyAdmin"], userController.getUserByID); // Informações sobre um usuário específico
router.delete("/users/:id", authVerifyToken, authorization["onlyAdmin"], userController.deleteUserByID); // Deleta um usuário específico

// Obtém as informações sobre os jogos vendidos por um vendedor por meio de um id especificado
router.get("/seller/:id/games", authVerifyToken, authorization["onlyAdmin"], userController.getGamesBySellerByID);

// Rotas comuns =========================================================================
router.get("/user", authVerifyToken, userController.getUserByJWT); // Obtém as próprias informações via token JWT
router.put("/user", authVerifyToken, userController.updateUser); // Atualiza as informações do usuário via token JWT
router.delete("/user", authVerifyToken, userController.deleteUserByJWT); // Deleta a própria conta de usuário via token JWT

// Rotas de vendedor ==============================================
router.get("/seller/games", authVerifyToken, authorization["onlySellers"], userController.getGamesBySeller); // informações sobre seus jogos cadastrados via token JWT

module.exports = router;