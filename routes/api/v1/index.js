var express = require('express');
var router = express.Router();
const geoMorphoUnits = require('./geoMorphoUnits')


router.use('/geo/', geoMorphoUnits)

router.get('/', function(req, res, next) {
  res.json({ title: 'V1 API' });
});

module.exports = router;
