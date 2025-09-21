const { Router } = require("express");

const {auth, adminOnly, sellerOnly, clientOnly} = require("./../controllers/authController");
const orderController = require("./../controllers/orderController");

const router = Router();

router.get("/checkout", auth, clientOnly, orderController.checkout);

module.exports = router;