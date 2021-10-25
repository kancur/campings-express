var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CampingSchema = new Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: false, minLength: 10, maxLength: 60 },
    description: { type: String, required: false, minLength: 20 },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    close_villages: [{ type: Schema.Types.ObjectId, ref: "Village" }],
    geo_units: [{ type: Schema.Types.ObjectId, ref: "GeoUnit" }],
    closest_village: {
      name: String,
      distance: Number,
    },
  },
  {
    strict:false,
    collection: "campings",
  }
);

//Export model
module.exports = mongoose.model("Campings", CampingSchema);
