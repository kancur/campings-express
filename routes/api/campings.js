var express = require('express');
var router = express.Router();
const campingControler = require('../../controllers/campingController')

//router.get('/', campingController.camping_get);

router.post('/', campingControler.camping_post)

module.exports = router;
