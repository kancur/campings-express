const express = require('express');
const router = express.Router();
const WaterbodyController = require('../../controllers/waterbodyController')

router.get('/list', WaterbodyController.waterbody_list );
router.get('/slug/:slug', WaterbodyController.waterbody_slug  )

module.exports = router