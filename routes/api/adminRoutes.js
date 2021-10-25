const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController')

router.get('/worker/camps-calculate-closest-villages', adminController.camping_calculate_closest_villages);

module.exports = router;
