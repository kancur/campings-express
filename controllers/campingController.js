const { body } = require('express-validator');
const validationResultHandlerMiddleware = require('../middleware/validationResultHanderMiddleware');
const closestVillagesMiddleware = require('../middleware/closestVillagesMiddleware')
const Camping = require('../models/camping');
const ObjectId = require('mongoose').Types.ObjectId;
const getClosestCampings = require('../helpers/getClosestCampings');
const bodyLogger = require('../middleware/bodyLogger');
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const s3 = require('../helpers/aws');

const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 10 * 1024 * 1024, // 10 MB (max file size)
};
const storage = multerS3({
  limits: limits,
  s3: s3,
  bucket: 'campings-s3',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(
      null,
      `camps/featured/${req.body.slug + path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

exports.camping_detail_get = async function (req, res, next) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    next(new Error('Invalid id'));
    return;
  }

  try {
    const response = await Camping.findOne({ _id: id })
      //.populate('closest_village')
      //.populate('geo_units', '-geometry -__v')
      .lean();

    res.json({ ...response });
  } catch (error) {
    return next(error);
  }
};

exports.camping_slug_get = async function (req, res, next) {
  const slug = req.params.slug;
  console.log('getting camping by slug', slug)
  try {
    const response = await Camping.findOne({ slug: slug })
      .populate('closest_village', '-campings')
      .lean();

    if (!response) {
      res.status(404).json({status: 404, message: 'Camping not found'});
    } else {
      res.json({ ...response });
    }
  } catch (error) {
    return next(error);
  }
};

exports.camping_get = async function (req, res, next) {
  const villageID = req.query.village;
  const geoUnitID = req.query.geounit;

  if (!(villageID || geoUnitID)) {
    return next(new Error('No [village] or [geounit] parameters supplied.'));
  }

  if (villageID) {
    if (!ObjectId.isValid(villageID)) {
      return next(new Error('Invalid village id'));
    }
    const response = await Camping.find({ close_villages: villageID }).lean();
    res.json([...response]);
    return;
  }

  if (geoUnitID) {
    if (!ObjectId.isValid(geoUnitID)) {
      next(new Error('Invalid geounit id'));
      return;
    }
    res.json({ 'not implemented yet': 'ok' });
    return;
  }
};

exports.camping_create_post = [
  upload.single('featured_image'),

  async (req, res, next) => {
    const payload = JSON.parse(req.body.payload);
    req.body = { ...req.body, ...payload };
    next();
  },

  //bodyLogger,
  body('name', 'name must be longer than 3 chars (camp name)')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('coords', 'coords has to be an object with lat and lon fields').isObject(),
  body('slug', 'slug is missing')
    .trim()
    .isString()
    .isLength({ min: 3 })
    .escape(),

  //custom middleware
  validationResultHandlerMiddleware,
  // get closest village for lat long
  closestVillagesMiddleware,
  // get close geomorphological units
  //closeGeoUnitsMiddleware,

  async (req, res, next) => {
    //const geoUnits = res.locals.closeGeoUnits.map((geounit) => geounit._id);

    const filter = {};

    if (req.body._id) {
      // will find and update by this id
      filter['_id'] = req.body._id;
    } else {
      // will create a new record using a new ObjectId
      filter['_id'] = ObjectId();
    }
    
    const update = {
      name: req.body.name,
      coords: req.body.coords,
      slug: req.body.slug,
      short_description: req.body.short_description,
      website: req.body.website,
      villages: res.locals.closestVillages
    };

    if (req.file) {
      update['featured_image'] = req.file.key;
    }

    try {
      const saved = await Camping.findOneAndUpdate(filter, update, {
        upsert: true,
        useFindAndModify: false,
        new: true,
      });

      //close_villages: res.locals.closestVillages.map((village) => village._id),
      //geo_units: [...geoUnits],
      /* closest_village: {
        name: res.locals.closestVillages[0].name,
        distance: res.locals.closestVillages[0].distance,
      }, 
    }); */

      res.json({ status: 'saved' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
];

exports.camping_close_get = async function (req, res, next) {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const limit = req.query.limit || 10;
  const maxDistance = req.query.distance;

  function isLatitude(lat) {
    return isFinite(lat) && Math.abs(lat) <= 90;
  }
  function isLongitude(lon) {
    return isFinite(lon) && Math.abs(lon) <= 180;
  }

  if (!isLatitude || !lat) {
    return next(new Error('Latitude out of bounds, wrong format or missing'));
  }
  if (!isLongitude || !lon) {
    return next(new Error('Longitude out of bounds, wrong format or missing'));
  }

  const campings = await getClosestCampings({ lat, lon }, limit, maxDistance);
  if (campings) {
    res.json(campings);
  }
};

exports.camping_get_list = async function (req, res, next) {
  try {
    const response = await Camping.find().lean();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.camping_slug_exists_get = async function (req, res, next) {
  const slug = req.query.slug;

  try {
    const response = await Camping.find({ slug: slug }).lean();
    if (response.length === 0) {
      res.json({ unique: true });
    } else {
      res.json({ unique: false });
    }
  } catch (error) {
    next(error);
  }
};

exports.camping_delete = async function (req, res, next) {
  const id = req.params.id;

  try {
    const response = await Camping.findByIdAndDelete(id);
    res.json({ status: 'deleted' });
  } catch (error) {
    next(error);
  }
}