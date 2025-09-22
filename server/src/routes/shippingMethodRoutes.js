const { Router } = require("express");

const {auth, adminOnly, sellerOnly, clientOnly} = require("./../controllers/authController");
const shippingMethodController = require("./../controllers/shippingMethodController");

const router = Router();

// Rotas públicas
router.get('/shipping/methods', shippingMethodController.getAllShippingMethods);
module.exports = router;