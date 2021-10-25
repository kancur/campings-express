const Camping = require("../models/camping");
var ObjectId = require("mongoose").Types.ObjectId;
const getClosestVillages = require("../helpers/getClosestVillages");

exports.camping_calculate_closest_villages = async function (req, res, next) {
  try {
    const campings = await Camping.find().lean();

    for (const camp of campings) {
      const closeVillages = await getClosestVillages(camp.coords);
      const updated = await Camping.findOneAndUpdate({ _id: camp._id }, { villages: closeVillages }, {new: true});
    }
    res.json({status: "ok"});
  } catch (error) {
    next(error);
    return;
  }
};
