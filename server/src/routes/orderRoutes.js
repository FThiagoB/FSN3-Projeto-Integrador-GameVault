const { Router } = require("express");

const {auth, adminOnly, sellerOnly, clientOnly} = require("./../controllers/authController");
const orderController = require("./../controllers/orderController");

const router = Router();

router.get("/checkout", auth, clientOnly, orderController.getCheckoutInfo);
router.post("/checkout", auth, clientOnly, orderController.processCheckout);

router.get("/transactions", auth, clientOnly, orderController.getTransactionsByJWT);
router.get("/transactions/:id", auth, adminOnly, orderController.getTransactionsByID);

// Rotas que irão para outro lugar depois
router.get("/coupons", auth, adminOnly, orderController.getCoupons);
router.post("/coupons/validate", orderController.validateCoupon); 

module.exports = router;