const { Router } = require("express");

const {auth, adminOnly, sellerOnly} = require("./../controllers/authController");
const upload = require("../utils/uploadConfig");

const userController = require("./../controllers/userController");
const adminController = require("./../controllers/adminController.js");

const router = Router();

router.use("/admin", auth);
router.use("/admin", adminOnly); 

// Atualiza o cargo de um usuário específico
router.patch("/admin/user/:userID/role", userController.updateUserRole);

// Lista os usuários que desejam ser vendedores
router.get('/admin/pending-sellers', userController.getPendingSellers);

// Obtém as principais informações do sistema
router.get('/admin/dashboard', adminController.getDashboadInfo);

// Transforma um usuário em vendedor
router.patch('/admin/user/:userID/seller', adminController.setUserToSeller);


// Atualiza o cargo de um usuário específico
router.delete("/admin/user/:userID", adminController.deleteUserByID);

module.exports = router;