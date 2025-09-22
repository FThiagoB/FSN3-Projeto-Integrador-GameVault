const { Router } = require("express");

const {auth, adminOnly, sellerOnly} = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const upload = require("../utils/uploadConfig");

const router = Router();

// Rotas comuns =========================================================================
router.post("/signin", userController.createUser);  // Rota para cadastrar um usuário
router.get("/uploads/users/:image", userController.getUserImage);
router.patch("/user/picture/remove", auth, userController.removeUserPicture);

router.get("/user", auth, userController.getUserByJWT);          // Obtém as próprias informações via token JWT
router.put("/user", auth, upload.single("file"), userController.updateUser);            // Atualiza as informações do usuário via token JWT
router.delete("/user", auth, userController.deleteUserByJWT);    // Deleta a própria conta de usuário via token JWT

router.put("/user/update/email", auth, userController.updateUserEmail); // Atualiza as informações de email requerindo o email atual
router.put("/user/update/password", auth, userController.updateUserPassword); // Atualiza a senha requerindo a senha atual

// Rotas para o admin ====================================================================
router.get("/users", auth, adminOnly, userController.getUsers);                 // Lista de todos os usuários cadastrados no sistema
router.get("/users/:id", auth, adminOnly, userController.getUserByID);          // Informações sobre um usuário específico
router.delete("/users/:id", auth, adminOnly, userController.deleteUserByID);    // Deleta um usuário específico

// Obtém as informações sobre os jogos vendidos por um vendedor por meio de um id especificado
router.get("/seller/:id/games", auth, adminOnly, userController.getGamesBySellerByID);

// Rotas de vendedor ==============================================
router.get("/seller/games", auth, sellerOnly, userController.getGamesBySeller); // informações sobre seus jogos cadastrados via token JWT

// Definir endereço padrão
router.put("/user/default-address/:addressId", auth, userController.setDefaultAddress);

// Definir método de pagamento padrão
router.put("/user/default-payment-method/:methodId", auth, userController.setDefaultPaymentMethod);

// Remover endereço padrão
router.delete("/user/default-address", auth, userController.removeDefaultAddress);

// Remover método de pagamento padrão
router.delete("/user/default-payment-method", auth, userController.removeDefaultPaymentMethod);

module.exports = router;