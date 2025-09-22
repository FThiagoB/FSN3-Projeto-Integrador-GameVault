const { Router } = require("express");

const {auth, adminOnly, sellerOnly, clientOnly} = require("./../controllers/authController");
const orderController = require("./../controllers/orderController");

const router = Router();

// router.get("/transactions/", auth, adminOnly, orderController.getTransactions);
// router.get("/transactions/user/:id", auth, adminOnly, orderController.getTransactionsByUserID);
// router.get("/transactions/user/:id/:orderID", auth, adminOnly, orderController.getTransactionByUserID);
router.get("/transactions/user/me", auth, clientOnly, orderController.getTransactionsByJWT);
router.get("/transactions/user/me/:orderID", auth, clientOnly, orderController.getTransactionByJWT);

router.get("/transactions/seller/:id", auth, adminOnly, orderController.getTransactionsBySellerID);
router.get("/transactions/seller/:id/:orderID", auth, adminOnly, orderController.getTransactionBySellerID);
router.get("/transactions/seller/me", auth, sellerOnly, orderController.getTransactionsBySellerJWT);
router.get("/transactions/seller/me/:orderID", auth, sellerOnly, orderController.getTransactionBySellerJWT);


// Rotas que irão para outro lugar depois
router.get("/checkout", auth, clientOnly, orderController.getCheckoutInfo);
router.post("/checkout", auth, clientOnly, orderController.processCheckout);
router.post("/cart/valide", auth, orderController.validateCart)

router.get("/seller/me/summary", auth, sellerOnly, orderController.getSummaryBySellerJWT);
router.get("/seller/:id/summary", auth, adminOnly, orderController.getSummaryBySellerID);

// Rotas para gerenciar os estados dos pedidos
router.put("/orders/me/:orderID/cancel", auth, clientOnly, orderController.cancelOrderByClient);
router.put("/orders/me/:orderID/received", auth, clientOnly, orderController.receivedOrderByClient);

router.put("/seller/orders/me/:orderID/cancel", auth, sellerOnly, orderController.cancelOrderBySeller);
router.put("/seller/orders/me/:orderID/ship", auth, sellerOnly, orderController.shipOrderBySeller);

router.put("/orders/:orderID/status", auth, adminOnly, orderController.updateOrderStatusByAdmin);

module.exports = router;