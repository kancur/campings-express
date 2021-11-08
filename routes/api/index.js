const express = require('express');
const router = express.Router();

const geoUnitRoutes = require('./geoUnitRoutes');
const campingRoutes = require('./campingRoutes');
const villageRoutes = require('./villageRoutes');
const combinedRoutes = require('./combinedRoutes');
const searchRoutes = require('./searchRoutes');
const adminRoutes = require('./adminRoutes');
const waterbodyRoutes = require('./waterbodyRoutes');
const authRoutes = require('./authRoutes');

router.use('/geo', geoUnitRoutes);
router.use('/camping', campingRoutes);
router.use('/village', villageRoutes);
router.use('/combined', combinedRoutes);
router.use('/search', searchRoutes);
router.use('/admin', adminRoutes);
router.use('/waterbody', waterbodyRoutes);
router.use('/auth', authRoutes);

module.exports = router;
