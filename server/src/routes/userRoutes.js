const { Router } = require("express");

const {auth, adminOnly, sellerOnly} = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const upload = require("../utils/uploadConfig");

const router = Router();

// Criação de um usuário via dados de formulário
router.post("/signin", userController.createUser);  

// Obtém a imagem de usuário do diretório de uploads
router.get("/uploads/users/:image", userController.getUserImage);

// Remove a imagem do usuário (define a imagem padrão como foto de perfil)
router.patch("/user/picture/remove", auth, userController.removeUserPicture);

// Obtém as próprias informações via token JWT
router.get("/user", auth, userController.getUserByJWT);          

// Atualiza as informações do usuário via token JWT
router.put("/user", auth, upload.single("file"), userController.updateUser);

// Deleta a própria conta de usuário via token JWT
router.delete("/user", auth, userController.deleteUserByJWT);    

// Atualiza as informações de email requerindo o email atual
router.put("/user/update/email", auth, userController.updateUserEmail); 

// Atualiza a senha requerindo a senha atual
router.put("/user/update/password", auth, userController.updateUserPassword); 

// informações sobre seus jogos cadastrados via token JWT
router.get("/seller/games", auth, sellerOnly, userController.getGamesBySeller); 

module.exports = router;