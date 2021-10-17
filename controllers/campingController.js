const testLib = require("../helpers/getClosestVillages");
const { body, validationResult } = require("express-validator");
const validationResultHandlerMiddleware = require("../middleware/validationResultHanderMiddleware");
const closestVillagesMiddleware = require("../middleware/closestVillagesMiddleware");
const closeGeoUnitsMiddleware = require("../middleware/closeGeoUnitsMiddleware");
const Camping = require("../models/camping");
var ObjectId = require("mongoose").Types.ObjectId;
const getClosestCampings = require("../helpers/getClosestCampings");

exports.camping_detail_get = async function (req, res, next) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    next(new Error("Invalid id"));
    return;
  }

  try {
    const response = await Camping.findOne({ _id: id })
      .populate("close_villages")
      .populate("geo_units", "-geometry -__v")
      .lean();

    res.json({ ...response });
  } catch (error) {
    return next(error);
  }
};

exports.camping_get = async function (req, res, next) {
  const villageID = req.query.village;
  const geoUnitID = req.query.geounit;

  if (!(villageID || geoUnitID)) {
    return next(new Error("No [village] or [geounit] parameters supplied."));
    return;
  }

  if (villageID) {
    if (!ObjectId.isValid(villageID)) {
      return next(new Error("Invalid village id"));
    }
    const response = await Camping.find({ close_villages: villageID }).lean();
    res.json([...response]);
    return;
  }

  if (geoUnitID) {
    if (!ObjectId.isValid(geoUnitID)) {
      next(new Error("Invalid geounit id"));
      return;
    }
    res.json({ "not implemented yet": "ok" });
    return;
  }
};

exports.camping_post = [
  body("name", "name must be longer than 3 chars (camp name)").trim().isLength({ min: 3 }).escape(),
  body("lat", "lat must be a numeric value (latitude)").trim().isNumeric().escape(),
  body("lon", "lon must be a numeric value (longitude)").trim().isNumeric().escape(),

  //custom middleware
  validationResultHandlerMiddleware,
  // get closest village for lat long
  //closestVillagesMiddleware,
  // get close geomorphological units
  //closeGeoUnitsMiddleware,

  async (req, res, next) => {
    const geoUnits = res.locals.closeGeoUnits.map((geounit) => geounit._id);

    console.log(res.locals.closestVillages[0]);

    const camp = new Camping({
      name: req.body.name,
      lat: req.body.lat,
      lon: req.body.lon,
      //close_villages: res.locals.closestVillages.map((village) => village._id),
      //geo_units: [...geoUnits],
      closest_village: {
        name: res.locals.closestVillages[0].name,
        distance: res.locals.closestVillages[0].distance,
      },
    });

    const saved = await camp.save();

    res.json(saved);
  },
];

exports.camping_close_get = async function (req, res, next) {
  const lat = req.query.lat;
  const lon = req.query.lon;

  function isLatitude(lat) {
    return isFinite(lat) && Math.abs(lat) <= 90;
  }
  function isLongitude(lon) {
    return isFinite(lon) && Math.abs(lon) <= 180;
  }

  if (!isLatitude || !lat) {
    return next(new Error("Latitude out of bounds, wrong format or missing"));
  }
  if (!isLongitude || !lon) {
    return next(new Error("Longitude out of bounds, wrong format or missing"));
  }

  const campings = await getClosestCampings({ lat, lon });
  if (campings) {
    res.json(campings);
  }
};
