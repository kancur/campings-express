const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController')

router.get('/worker/camps-calculate-closest-villages', adminController.camping_calculate_closest_villages);
router.get('/worker/camps-calculate-slugs', adminController.camping_calculate_slugs);
router.get('/worker/villages-calculate-close-campings', adminController.villages_calculate_closest_campings);
router.get('/worker/waterbodies-calculate-close-campings', adminController.water_bodies_calculate_closest_campings);
module.exports = router;
