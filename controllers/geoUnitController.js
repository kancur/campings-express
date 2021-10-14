const GeoUnit = require("../models/geoUnit");

exports.geoUnit_list = function (req, res, next) {
  GeoUnit.find()
    .select('uid')
    .exec(function (err, geoMorphoUnits) {
    if (err) {
      return next(err);
    }
    res.json({ geo_units: geoMorphoUnits});
  });
};

exports.geoUnit_detail = function (req, res, next) {
  if (!req.query.id) {
    next(new Error("Missing query id"));
    return;
  }

  const hasGeoData = (req.query.geo == 'true') ? true : false;

  GeoUnit.findOne({ "properties.@id": req.query.id }).exec(function (
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
