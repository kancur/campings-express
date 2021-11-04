var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var WaterBodySchema = new Schema(
  {},
  {
    strict: false,
    collection: "water_bodies",
  }
);

module.exports = mongoose.model("WaterBody", WaterBodySchema);
