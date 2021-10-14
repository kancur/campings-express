var express = require('express');
var router = express.Router();
const geoMorphoUnitController = require('../../controllers/geoUnitController')

/* GET home page. */
router.get('/', geoMorphoUnitController.geoUnit_detail);

router.get('/list', geoMorphoUnitController.geoUnit_list)

module.exports = router;
