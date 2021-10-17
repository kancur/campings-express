const Village = require('../models/village')

exports.village_list = async function (req, res, next) {
  try {
    const data = await Village.find().select('slug name -_id').exec();
    res.json(data);
  } catch (error) {
    next(error);
    return;
  }
}

exports.village_slug = async function (req, res, next) {
  try {
    const data = await Village.findOne({slug: req.params.slug}).exec();
    res.json(data)
  } catch (error) {
    next(error)
  }
}