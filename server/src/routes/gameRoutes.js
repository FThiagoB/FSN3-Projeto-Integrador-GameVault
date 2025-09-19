const { Router } = require("express");
const gameController = require("../controllers/gameController");
const upload = require("../utils/uploadConfig");

const {authVerifyToken, authorization} = require("./../controllers/authController");

const router = Router();

// Rota para listar os jogos
router.get("/games", gameController.getGames);

// Rota para obter os gêneros dos jogos
router.get("/games/genres", gameController.getGenres);

// Obtém informações sobre um jogo aleatório da lista
router.get("/games/random", gameController.getRandomGame);

// Obtém informações sobre um jogo específico
router.get("/games/:id", gameController.infoGame);

// Rota para acessar uma imagem especifica
router.get("/uploads/games/:image", gameController.getGameImage);

// As rotas abaixo são acessíveis apenas para vendedores ou o admin
// Cadastro de um jogo
router.post("/games", authVerifyToken, authorization["onlySellers"], upload.single("image"), gameController.createGame);

// Deleta um jogo especifico
router.delete("/games/:id", authVerifyToken, authorization["onlySellers"], gameController.deleteGame);

// Atualiza as informações de um jogo específico
router.put("/games/:id", authVerifyToken, authorization["onlySellers"], upload.single("image"), gameController.updateGame);

module.exports = router;
