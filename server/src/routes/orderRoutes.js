const { Router } = require("express");

const {auth, adminOnly, sellerOnly, clientOnly} = require("./../controllers/authController");
const orderController = require("./../controllers/orderController");

const router = Router();

router.get("/orders/me", auth, clientOnly, orderController.getTransactionsByJWT);
router.delete("/orders/me/:orderID", auth, clientOnly, orderController.cancelOrderByClient);
router.put("/orders/me/:orderID", auth, clientOnly, orderController.setStateOrderByClient);

router.get("/seller/orders/me", auth, sellerOnly, orderController.getTransactionsBySellerJWT);
router.get("/seller/orders/:orderID", auth, sellerOnly, orderController.getTransactionBySellerJWT);
router.delete("/seller/orders/me/:orderID", auth, sellerOnly, orderController.cancelOrderBySeller);
router.patch("/seller/orders/me/:orderID/:itemID", auth, sellerOnly, orderController.changeStatusOrderItemBySeller);

router.get("/checkout", auth, clientOnly, orderController.getCheckoutInfo);
router.post("/checkout", auth, clientOnly, orderController.processCheckout);
router.post("/cart/valide", auth, orderController.validateCart)

module.exports = router;