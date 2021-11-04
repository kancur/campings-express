const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampingSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    short_description: { type: String, required: false, minLength: 20 },
    website: { type: String, required: false },
    featured_image: { type: String, required: false },
    coords: { lat: { type: Number, required: true }, lon: { type: Number, required: true } },
  },
  {
    strict: false,
    collection: "campings",
  }
);

module.exports = mongoose.model("Camping", CampingSchema);
