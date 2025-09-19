// server/src/routes/gameRoutes.js (ou seu arquivo de rotas)

const { Router } = require("express");
const gameController = require("../controllers/gameController");
const upload = require("../utils/uploadConfig");

const router = Router();

// Rotas de Games
router.get("/games", gameController.getGames);

// ✅ ROTA ESPECÍFICA ANTES DA ROTA GENÉRICA
router.get("/games/genres", gameController.getGenres);

router.get("/games/random", gameController.getRandomGame);

// A rota com :id (genérica) vem DEPOIS
router.get("/games/:id", gameController.infoGame);

router.get("/uploads/games/:image", gameController.getGameImage);

router.post("/games", upload.single("image"), gameController.createGame);
router.delete("/games/:id", gameController.deleteGame);
router.put("/games/:id", upload.single("image"), gameController.updateGame);

module.exports = router;
