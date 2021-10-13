const testLib = require("../helpers/getClosestVillages");
const { body, validationResult } = require("express-validator");
const validationResultHandlerMiddleware = require("../middleware/validationResultHanderMiddleware");
const closestVillagesMiddleware = require("../middleware/closestVillagesMiddleware");
const closeGeoUnitsMiddleware = require("../middleware/closeGeoUnitsMiddleware");
const Camping = require("../models/camping");

exports.camping_get = async function (req, res, next) {
  const villageID = req.body.village || null;
  const geoUnitID = req.body.geounit || null;

  const response = await Camping.find({'closest_village': villageID})
  res.json({ response });
};

exports.camping_post = [
  body("name", "name must be longer than 3 chars (camp name)").trim().isLength({ min: 3 }).escape(),
  body("lat", "lat must be a numeric value (latitude)").trim().isNumeric().escape(),
  body("lon", "lon must be a numeric value (longitude)").trim().isNumeric().escape(),

  //custom middleware
  validationResultHandlerMiddleware,
  // get closest village for lat long
  closestVillagesMiddleware,
  // get close geomorphological units
  closeGeoUnitsMiddleware,

  async (req, res, next) => {
    const geoUnits = (res.locals.closeGeoUnits.map((geounit) => geounit._id))

    console.log(res.locals.closestVillages[0])

    const camp = new Camping({
      name: req.body.name,
      lat: req.body.lat,
      lon: req.body.lon,
      close_villages: ((res.locals.closestVillages).map((village) => village._id)),
      geo_units: [...geoUnits],
      closest_village: {
        name: res.locals.closestVillages[0].name,
        distance: res.locals.closestVillages[0].distance
      }

    })

    // not saving right now !!
    //const saved = await camp.save()

    res.json(camp);
  },
];
