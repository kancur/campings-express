const User = require('../models/User');
const {
  requireAuth,
  requireAuthResHandler,
} = require('../middleware/authMiddleware');
const ObjectId = require('mongoose').Types.ObjectId;
const Camping = require('../models/camping');
const { FavoriteCamp } = require('../models/favoriteCamp');

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
      const campData = { camp: ObjectId(id) };
      const favoriteDoc = new FavoriteCamp(campData);

      if (!currentUser.favorite_camps.some((favorite) => favorite.camp == id)) {
        currentUser.favorite_camps.push(favoriteDoc);
        await currentUser.save();
      }

      const data = await User.findById(user._id, 'favorite_camps')
        .populate({
          path: 'favorite_camps',
          populate: {
            path: 'camp',
            select: 'name slug featured_image short_description',
          },
        })
        .lean()
        .exec();
      res.json(data.favorite_camps);
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
      await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { favorite_camps: { camp: id } } }
      );
      /*    const currentUser = await User.findById(user._id);
      const favoriteCampId = { _id: ObjectId(id) };
      const removed = currentUser.favorite_camps.remove(favoriteCampId);
      const updated = await currentUser.save(); */

      const data = await User.findById(user._id, 'favorite_camps')
        .populate({
          path: 'favorite_camps',
          populate: {
            path: 'camp',
            select: 'name slug featured_image short_description',
          },
        })
        .lean()
        .exec();
      res.json(data.favorite_camps);
    } catch (err) {
      next(err);
    }
  },
];

exports.camp_get_favorites = [
  requireAuth,
  requireAuthResHandler,

  async (req, res, next) => {
    const user = res.locals.user;
    try {
      const data = await User.findById(user._id, 'favorite_camps')
        .populate({
          path: 'favorite_camps',
          populate: {
            path: 'camp',
            select: 'name slug featured_image short_description',
          },
        })
        .lean()
        .exec();
      res.json(data.favorite_camps);
    } catch (err) {
      next(err);
    }
  },
];
