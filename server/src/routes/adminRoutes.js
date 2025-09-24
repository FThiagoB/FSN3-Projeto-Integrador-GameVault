const { Router } = require("express");

const {auth, adminOnly, sellerOnly} = require("./../controllers/authController");
const upload = require("../utils/uploadConfig");

const userController = require("./../controllers/userController");

const router = Router();

router.use("/admin", auth);
router.use("/admin", adminOnly); 

// Atualiza o cargo de um usuário específico
router.patch("/admin/user/:userID/role", userController.updateUserRole);

module.exports = router;