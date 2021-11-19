const User = require('../models/User');
const {
  requireAuth,
  requireAuthResHandler,
} = require('../middleware/authMiddleware');
const ObjectId = require('mongoose').Types.ObjectId;
const Camping = require('../models/camping');

exports.camp_add_favorites = [
  requireAuth,
  requireAuthResHandler,

  async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      return res.json({ error: 'missing camp id' });
    }

    const user = res.locals.user;
    try {
      const currentUser = await User.findById(user._id);
      const favoriteCampId = { _id: ObjectId(id) };
      const added = currentUser.favorite_camps.addToSet(favoriteCampId);
      const updated = await currentUser.save();

      const newFavorites = await Camping.find({
        _id: { $in: updated.favorite_camps },
      }).select('name slug featured_image short_description');
      res.json(newFavorites);
    } catch (err) {
      next(err);
    }
  },
];

exports.camp_delete_favorites = [
  requireAuth,
  requireAuthResHandler,

  async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      return res.json({ error: 'missing camp id' });
    }

    const user = res.locals.user;
    try {
      const currentUser = await User.findById(user._id);
      const favoriteCampId = { _id: ObjectId(id) };
      const removed = currentUser.favorite_camps.remove(favoriteCampId);
      const updated = await currentUser.save();

      const newFavorites = await Camping.find({
        _id: { $in: updated.favorite_camps },
      }).select('name slug featured_image short_description');
      res.json(newFavorites);
    } catch (err) {
      next(err);
    }
  },
];

exports.camp_get_favorites = [
  requireAuth,
  requireAuthResHandler,

  async (req, res, next) => {
    const with_data = req.query.with_data;
    const user = res.locals.user;
    try {
      const response = await User.findOne({ _id: user._id })
        .populate(
          with_data ? 'favorite_camps' : '',
          'name slug featured_image short_description'
        )
        .lean();
      res.json(response.favorite_camps);
    } catch (err) {
      next(err);
    }
  },
];
