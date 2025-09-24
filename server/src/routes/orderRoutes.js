const { Router } = require("express");

const {auth, adminOnly, sellerOnly, clientOnly} = require("./../controllers/authController");
const orderController = require("./../controllers/orderController");

const router = Router();

router.get("/orders/me", auth, clientOnly, orderController.getTransactionsByJWT);
router.delete("/orders/me/:orderID", auth, clientOnly, orderController.cancelOrderByClient);
router.put("/orders/me/:orderID", auth, clientOnly, orderController.setStateOrderByClient);

router.get("/seller/orders/me", auth, sellerOnly, orderController.getTransactionsBySellerJWT);
router.delete("/seller/orders/me/:orderID", auth, sellerOnly, orderController.cancelOrderBySeller);

router.get("/checkout", auth, clientOnly, orderController.getCheckoutInfo);
router.post("/checkout", auth, clientOnly, orderController.processCheckout);
router.post("/cart/valide", auth, orderController.validateCart)

module.exports = router;