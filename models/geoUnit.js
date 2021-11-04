var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GeoMorphoUnitSchema = new Schema(
  {},
  {
    strict: false,
    collection: "geomorphological_units",
  }
);

module.exports = mongoose.model("GeoUnit", GeoMorphoUnitSchema);
