const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteCampSchema = new Schema(
  {
    camp: { type: Schema.Types.ObjectId, ref: 'Camping' },
  },
  { timestamps: { createdAt: true, updatedAt: false } } 
);

module.exports.favoriteCampSchema = favoriteCampSchema;
module.exports.FavoriteCamp = mongoose.model('FavoriteCamp', favoriteCampSchema);