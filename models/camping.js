var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CampingSchema = new Schema(
  {
    name:  {type: String, required: true},
    description: String,
    lat: {type: Number, required: true},
    long: {type: Number, required: true},
    closest_village: {type: Schema.Types.ObjectId, ref: 'Village'},
    geomorphological_units: [{type: Schema.Types.ObjectId, ref: 'GeoMorphoUnit'}]
  },
  {
    //strict:false,
    collection : 'campings'
  }
);

//Export model
module.exports = mongoose.model('Campings', CampingSchema);