var express = require('express');
var router = express.Router();
const geoMorphoUnitController = require('../../../controllers/geoMorphoUnitController')

/* GET home page. */
router.get('/', geoMorphoUnitController.geoMorphoUnit_detail);

router.get('/list', geoMorphoUnitController.geoMorphoUnit_list)

module.exports = router;
