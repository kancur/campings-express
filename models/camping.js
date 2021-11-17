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
    villages: { type: Schema.Types.ObjectId, ref: "Village" },
  },
  {
    strict: false,
    collection: "campings",
  }
);

CampingSchema.virtual('closest_village', {
  ref: 'Village',
  localField: 'villages[0]._id',
  foreignField: '_id',
  justOne: true,
})

CampingSchema.set('toObject', { virtuals: true });
CampingSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Camping", CampingSchema);
