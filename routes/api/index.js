var express = require('express');
var router = express.Router();
const geoMorphoUnits = require('./geoMorphoUnits')
const campings = require('./campings')

router.use('/geo/', geoMorphoUnits)
router.use('/camping/', campings)

router.get('/', function(req, res, next) {
  res.json({ title: 'V1 API' });
});


module.exports = router;
