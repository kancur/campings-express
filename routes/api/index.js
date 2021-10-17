const express = require("express");
const router = express.Router();

const geoUnitRoutes = require("./geoUnitRoutes");
const campingRoutes = require("./campingRoutes");
const villageRoutes = require("./villageRoutes");
const combinedRoutes = require("./combinedRoutes");
const searchRoutes = require("./searchRoutes");

router.use("/geo/", geoUnitRoutes);
router.use("/camping/", campingRoutes);
router.use("/village/", villageRoutes);
router.use("/combined/", combinedRoutes);
router.use("/search/", searchRoutes);

router.get("/", function (req, res, next) {
  res.json({ title: "V1 API" });
});

module.exports = router;
