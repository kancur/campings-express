const GeoUnit = require("../models/geoUnit");

exports.geoUnit_list = async function (req, res, next) {
  try {
    const data = await GeoUnit.find().select("_id properties.name properties.natural").exec();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.geoUnit_detail = async function (req, res, next) {
  if (!req.query.id) {
    next(new Error("Missing id parameter"));
    return;
  }

  const hasGeoData = req.query.geo == "true" ? true : false;

  try {
    const data = GeoUnit.findOne({ "properties.@id": req.query.id }).lean().exec()
    if (hasGeoData) {
      res.json(geodata);
    }
    // filtering out geometry out of data
    const { geometry, ...exceptGeometry } = geodata;
    res.json(exceptGeometry);

  } catch (error) {
    next(error)   
  }
 
    
  
};
