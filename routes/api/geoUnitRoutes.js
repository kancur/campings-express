var express = require('express');
var router = express.Router();
const geoUnitController = require('../../controllers/geoUnitController')

/* GET home page. */
router.get('/list', geoUnitController.geoUnit_list);
router.get('/slug/:slug', geoUnitController.geoUnit_slug);
router.get('/:id', geoUnitController.geoUnit_detail);


module.exports = router;
