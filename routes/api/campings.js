var express = require('express');
var router = express.Router();
const campingControler = require('../../controllers/campingController')

router.get('/:id',  campingControler.camping_detail_get);
router.get('/',  campingControler.camping_get);

router.post('/', campingControler.camping_post)

module.exports = router;
