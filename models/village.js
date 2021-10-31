var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VillageSchema = new Schema(
  {
    campings: [{ type: Schema.Types.ObjectId, ref: 'Camping' }]
  },
  {
    strict:false,
    collection : 'villages'
  }
);
//Export model
module.exports = mongoose.model('Village', VillageSchema);