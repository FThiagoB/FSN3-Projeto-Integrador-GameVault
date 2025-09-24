const { Router } = require("express");

const {auth, adminOnly, sellerOnly, clientOnly} = require("./../controllers/authController");
const couponController = require("./../controllers/couponController");

const router = Router();

// Rotas públicas
router.post('/coupons/validate', couponController.validateCoupon);
router.get('/coupons', couponController.getCoupons);

module.exports = router;