const { Router } = require("express");

const {auth, adminOnly, sellerOnly, clientOnly} = require("./../controllers/authController");
const couponController = require("./../controllers/couponController");

const router = Router();

// Rotas públicas
router.post('/coupons/validate', couponController.validateCoupon);
router.get('/coupons', couponController.getCoupons);

// Rotas administrativas
router.get('/coupons/all', auth, adminOnly, couponController.getAllCoupons);
router.post('/coupons/create', auth, adminOnly, couponController.createCoupon);
router.put('/coupons/:id', auth, adminOnly, couponController.updateCoupon);
router.delete('/coupons/:id', auth, adminOnly, couponController.deleteCoupon);

module.exports = router;