const WaterBody = require("../models/waterBody");
const Village = require("../models/village");
const Geounit = require("../models/geoUnit")

const ObjectId = require("mongoose").Types.ObjectId;
const getClosestVillages = require("../helpers/getClosestVillages");
const toSlug = require("../helpers/toSlug");
const { prepareCloseCampingsBulkOp, prepareSlugBulkOp } = require("../helpers/dbOperations");


exports.camping_calculate_closest_villages = async function (req, res, next) {
  try {
    const campings = await Camping.find().lean();

    for (const camp of campings) {
      const closeVillages = await getClosestVillages(camp.coords);
      const updated = await Camping.findOneAndUpdate(
        { _id: camp._id },
        { villages: closeVillages },
        { new: true }
      );
    }
    res.json({ status: "ok" });
  } catch (error) {
    next(error);
    return;
  }
};

exports.camping_calculate_slugs = async function (req, res, next) {
  try {
    const campings = await Camping.find().lean();
    let hadSlugCount = 0;
    let calculatedSlugCount = 0;
    for (const camp of campings) {
      const hasSlug = !!camp.slug;
      if (!hasSlug && camp?.name) {
        calculatedSlugCount += 1;
        const autogenSlug = toSlug(camp.name);
        await Camping.findOneAndUpdate({ _id: camp._id }, { slug: autogenSlug });
      } else {
        hadSlugCount += 1;
      }
    }
    res.json({
      status: "done",
      had_slug_count: hadSlugCount,
      slug_calculated_count: calculatedSlugCount,
    });
  } catch (error) {
    next(error);
  }
};

exports.villages_calculate_closest_campings = async function (req, res, next) {
  try {
    const bulkOp = await prepareCloseCampingsBulkOp(Village)
    bulkOp.execute(function (err, result) {
      if (err) {
        return res.json({ error: err });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.log('error', error)
    next(error);
    return;
  }
}

exports.waterbodies_calculate_slugs = async function (req, res, next) {
  try {
    const bulkOp = await prepareSlugBulkOp(WaterBody)
    if (bulkOp.length === 0) {
      return res.json({"status": "bulkop didn't have any changes planned"})
    }
    bulkOp.execute(function (err, result) {
      if (err) {
        return res.json({ error: err });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.waterbodies_calculate_closest_campings = async function (req, res, next) {
  try {
    const bulkOp = await prepareCloseCampingsBulkOp(WaterBody)
    bulkOp.execute(function (err, result) {
      if (err) {
        return res.json({ error: err });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    next(error);
    return;
  }
};

exports.geounit_calculate_closest_campings = async function (req, res, next) {
  try {
    const bulkOp = await prepareCloseCampingsBulkOp(Geounit)
    bulkOp.execute(function (err, result) {
      if (err) {
        return res.json({ error: err });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    next(error);
    return;
  }
};