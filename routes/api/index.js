var express = require('express');
var router = express.Router();
const geoUnitRoutes = require('./geoUnitRoutes')
const campingRoutes = require('./campingRoutes')

router.use('/geo/', geoUnitRoutes)
router.use('/camping/', campingRoutes)

router.get('/', function(req, res, next) {
  res.json({ title: 'V1 API' });
});


module.exports = router;
