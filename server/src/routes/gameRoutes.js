const {Router} = require("express");
const gameController = require("../controllers/gameController");
const router = Router();

// Especifica os métodos do controlador que lidam com cada rota
router.get("/games", gameController.getGames);

module.exports = router;