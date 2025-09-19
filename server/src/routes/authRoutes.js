const {Router} = require("express");
const authController = require("../controllers/authController");

const router = Router();

// Especifica os métodos do controlador que lidam com cada rota
router.get("/login", authController.logging);

module.exports = router;