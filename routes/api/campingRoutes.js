const express = require('express');
const router = express.Router();
const campingController = require('../../controllers/campingController')

router.get('/',  campingController.camping_get);
router.post('/', campingController.camping_create_post)
router.get('/list', campingController.camping_get_list)
router.get('/close/', campingController.camping_close_get);
router.get('/slug-check', campingController.camping_slug_exists_get);
router.get('/slug/:slug',  campingController.camping_slug_get);
router.get('/:id',  campingController.camping_detail_get);
router.delete('/:id',  campingController.camping_delete);

module.exports = router;

