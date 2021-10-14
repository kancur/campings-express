const GeoUnit = require("../models/geoUnit");
var ObjectId = require("mongoose").Types.ObjectId;

exports.geoUnit_list = async function (req, res, next) {
  try {
    const data = await GeoUnit.find().select("_id properties.name properties.natural slug").exec();
    res.json(data);
  } catch (error) {
    next(error);
    return;
  }
};

exports.geoUnit_detail = async function (req, res, next) {
  const hasGeometryData = !!req.query.geometry;
  // validate if supplied ID is a valid ObjectId (mongodb)
  if (!ObjectId.isValid(req.params.id)) {
    next(new Error("Invalid geounit id"));
    return;
  }

  try {
    const data = await GeoUnit.findOne({ _id: req.params.id })
      .select(!hasGeometryData && "-geometry")
      .lean();
    res.json(data);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

exports.geoUnit_slug = async function (req, res, next) {
  const hasGeometryData = !!req.query.geometry;
  const slug = req.params.slug;

  try {
    const data = await GeoUnit.findOne({ slug: slug })
      .select(!hasGeometryData && "-geometry")
      .lean();
    res.json(data);
    return;
  } catch (error) {
    next(error);
    return;
  }
};
