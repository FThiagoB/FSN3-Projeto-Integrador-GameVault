const { Router } = require("express");
const gameController = require("../controllers/gameController");
const upload = require("../utils/uploadConfig");

const {auth, sellerOnly, optionalAuth} = require("./../controllers/authController");

const router = Router();

// Rota para listar os jogos
router.get("/games", optionalAuth, gameController.getGames);

// Rota para obter os gêneros dos jogos
router.get("/games/genres", gameController.getGenres);

// Obtém informações sobre um jogo aleatório da lista
router.get("/games/random", optionalAuth, gameController.getRandomGame);

// Obtém informações sobre um jogo específico
router.get("/games/:id", gameController.getGamesByID);

// Rota para acessar uma imagem especifica
router.get("/uploads/games/:image", gameController.getGameImage);

// As rotas abaixo são acessíveis apenas para vendedores ou o admin
// Cadastro de um jogo
router.post("/games", auth, sellerOnly, upload.single("file"), gameController.createGame);

// Deleta um jogo especifico
router.delete("/games/:id", auth, sellerOnly, gameController.deleteGame);

// Atualiza as informações de um jogo específico
router.put("/games/:id", auth, sellerOnly, upload.single("file"), gameController.updateGame);

module.exports = router;