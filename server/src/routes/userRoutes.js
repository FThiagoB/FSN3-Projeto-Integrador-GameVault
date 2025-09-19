const { Router } = require("express");

const {authVerifyToken, authorization} = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = Router();

router.get("/users", userController.getUsers);          // Liberada por enquanto, mas é uma rota apenas para o admin
router.get("/users/:id", userController.getUserByID);   // Liberada por enquanto, mas é uma rota apenas para o admin

router.get("/user", authVerifyToken, userController.getUserByJWT); // Retorna as informações do usuário do JWT 

module.exports = router;