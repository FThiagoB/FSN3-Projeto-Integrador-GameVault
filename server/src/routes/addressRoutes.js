const {Router} = require("express");
const addressController = require("../controllers/addressController");

const {auth, adminOnly, sellerOnly, clientOnly} = require("./../controllers/authController");
const router = Router();

router.get("/addresses", auth, addressController.getAddressesByJWT);
router.get("/addresses/:id", auth, addressController.getAddressByJWT);
router.post("/addresses", auth, addressController.createAddressByJWT);
router.put("/addresses/:id", auth, addressController.updateAddressByJWT);
router.delete("/addresses/:id", auth, addressController.deleteAddressByJWT);
router.patch("/addresses/:id/default", auth, addressController.setAsDefaultAddressByJWT);

module.exports = router;