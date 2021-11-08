const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WaterBodySchema = new Schema(
  {
    campings: [{ type: Schema.Types.ObjectId, ref: "Camping" }],
  },
  {
    strict: false,
    collection: "water_bodies",
  }
);

module.exports = mongoose.model("WaterBody", WaterBodySchema);
