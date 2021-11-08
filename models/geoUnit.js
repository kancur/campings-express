const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GeoMorphoUnitSchema = new Schema(
  {
    campings: [{ type: Schema.Types.ObjectId, ref: "Camping" }],
  },
  {
    strict: false,
    collection: "geomorphological_units",
  }
);

module.exports = mongoose.model("GeoUnit", GeoMorphoUnitSchema);
