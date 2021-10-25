const getClosestVillages = require("../helpers/getClosestVillages");
const Village = require("../models/village");

exports.village_list = async function (req, res, next) {
  try {
    const data = await Village.find().select("slug name -_id").exec();
    res.json(data);
  } catch (error) {
    next(error);
    return;
  }
};

exports.village_slug = async function (req, res, next) {
  try {
    const data = await Village.findOne({ slug: req.params.slug }).exec();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.closest_villages = async function (req, res, next) {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const limit = req.query.limit || 10;
  const maxDistance = req.query.distance;

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

  const villages = await getClosestVillages({ lat, lon }, limit, maxDistance);
  if (villages) {
    res.json(villages);
  }
};
