const express = require('express');
const router = express.Router();
const VillageController = require('../../controllers/villageController')

router.get('/list', VillageController.village_list );
router.get('/slug/:slug', VillageController.village_slug )
router.get('/close', VillageController.closest_villages)

module.exports = router