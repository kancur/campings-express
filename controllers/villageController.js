const Village = require('../models/village')


exports.village_list = async function (req, res, next) {
  try {
    const data = await Village.find().exec();
    res.json(data);
  } catch (error) {
    next(error);
    return;
  }
}