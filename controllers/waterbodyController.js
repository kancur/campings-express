const Waterbody = require("../models/waterBody");

exports.waterbody_list = async function (req, res, next) {
  try {
    const data = await Waterbody.find().select("slug name -_id").exec();
    res.json(data);
  } catch (error) {
    next(error);
    return;
  }
};

exports.waterbody_slug = async function (req, res, next) {
  try {
    const data = await Waterbody.findOne({ slug: req.params.slug }).populate('campings').exec();
    res.json(data);
  } catch (error) {
    next(error);
  }
};