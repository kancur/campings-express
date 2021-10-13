const testLib = require("../helpers/getClosestVillage");
const { body, validationResult } = require("express-validator");
const validationResultHandlerMiddleware = require("../middleware/validationResultHanderMiddleware");
const closestVillageMiddleware = require("../middleware/closestVillageMiddleware");
const closeGeoUnitsMiddleware = require("../middleware/closeGeoUnitsMiddleware");
const Camping = require("../models/camping");

exports.camping_get = async function (req, res, next) {
  const villageID = req.body.village || null;
  const geoUnitID = req.body.geounit || null;

  const response = await Camping.find()
  res.json({ response });
};

exports.camping_post = [
  body("name", "name must be longer than 3 chars (camp name)").trim().isLength({ min: 3 }).escape(),
  body("lat", "lat must be a numeric value (latitude)").trim().isNumeric().escape(),
  body("lon", "lon must be a numeric value (longitude)").trim().isNumeric().escape(),

  //custom middleware
  validationResultHandlerMiddleware,
  // get closest village for lat long
  closestVillageMiddleware,
  // get close geomorphological units
  closeGeoUnitsMiddleware,

  async (req, res, next) => {
    const geoUnits = (res.locals.closeGeoUnits.map((geounit) => geounit._id))

    const camp = new Camping({
      name: req.body.name,
      lat: req.body.lat,
      lon: req.body.lon,
      closest_village: res.locals.closestVillage._id,
      geo_units: [...geoUnits]
    })

    const saved = await camp.save()

    res.json(saved);
  },
];
