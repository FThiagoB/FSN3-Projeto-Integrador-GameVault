const {Router} = require("express");
const gameController = require("../controllers/gameController");
const upload = require('../utils/uploadConfig');

const router = Router();

// Especifica os métodos do controlador que lidam com cada rota
router.get("/games", upload.single('image'), gameController.getGames);
router.get("/games/:id", gameController.infoGame);
router.get("/uploads/games/:image", gameController.getGameImage);

router.post("/games", gameController.createGame);
router.delete("/games/:id", gameController.deleteGame);
router.put("/games/:id", upload.single('image'), gameController.updateGame);

module.exports = router;