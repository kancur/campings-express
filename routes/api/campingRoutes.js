const express = require('express');
const router = express.Router();
const campingController = require('../../controllers/campingController')

router.get('/',  campingController.camping_get);
router.post('/', campingController.camping_post)
router.get('/close/', campingController.camping_close_get);
router.get('/:id',  campingController.camping_detail_get);

module.exports = router;
