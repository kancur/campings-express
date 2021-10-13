var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CampingSchema = new Schema(
  {
    name:  {type: String, required: true},
    description: {type: String},
    lat: {type: Number, required: true},
    lon: {type: Number, required: true},
    closest_village: {type: Schema.Types.ObjectId, ref: 'Village'},
    geo_units: [{type: Schema.Types.ObjectId, ref: 'GeoUnit'}]
  },
  {
    //strict:false,
    collection : 'campings'
  }
);

//Export model
module.exports = mongoose.model('Campings', CampingSchema);