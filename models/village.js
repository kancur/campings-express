var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VillageSchema = new Schema(
  {},
  {
    strict:false,
    collection : 'villages'
  }
);
//Export model
module.exports = mongoose.model('Village', VillageSchema);