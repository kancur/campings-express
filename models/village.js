const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VillageSchema = new Schema(
  {
    campings: [{ type: Schema.Types.ObjectId, ref: "Camping" }],
  },
  {
    strict: false,
    collection: "villages",
  }
);

module.exports = mongoose.model("Village", VillageSchema);
