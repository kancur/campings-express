const GeoMorphoUnit = require("../models/geoMorphoUnit");

exports.geoMorphoUnit_list = function (req, res, next) {
  GeoMorphoUnit.find()
    .select('properties.@id')
    .exec(function (err, geoMorphoUnits) {
    if (err) {
      return next(err);
    }
    res.json({ geo_units: geoMorphoUnits});
  });
};

exports.geoMorphoUnit_detail = function (req, res, next) {
  if (!req.query.id) {
    next(new Error("Missing query id"));
    return;
  }

  const hasGeoData = (req.query.geo == 'true') ? true : false;

  GeoMorphoUnit.findOne({ "properties.@id": req.query.id }).exec(function (
    err,
    geodata
  ) {
    if (err) {
      return next(err);
    }

    if (hasGeoData) {
      res.json(geodata);
      return
    }

    const { geometry, ...exceptGeometry } = geodata.toObject();
    res.json(exceptGeometry);
  });
};
