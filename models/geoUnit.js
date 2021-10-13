var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeoMorphoUnitSchema = new Schema(
  {},
  {
    strict:false,
    collection : 'geomorphological_units'
  }
);

//Export model
module.exports = mongoose.model('GeoMorphoUnit', GeoMorphoUnitSchema);