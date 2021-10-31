const Village = require("../models/village");
var ObjectId = require("mongoose").Types.ObjectId;
const getClosestVillages = require("../helpers/getClosestVillages");
const toSlug = require("../helpers/toSlug");
const getClosestCampings = require("../helpers/getClosestCampings");

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
  let updateCount = 0;

  try {
    const villages = await Village.find().lean();
    var bulkOperation = Village.collection.initializeUnorderedBulkOp();

    for (const village of villages) {
      const closeCampings = await getClosestCampings(village.coords, 10);
      const idsOfCloseCampings = closeCampings.map((camp) => camp._id);
      bulkOperation.find({ _id: village._id }).updateOne({ $set: { campings: idsOfCloseCampings } });

      /* const updated = await Village.findOneAndUpdate(
        { _id: village._id },
        { campings: idsOfCloseCampings },
        { new: true }
      ); */
      updateCount += 1;
      console.log("updating:", updateCount);
    }

    bulkOperation.execute(function (err, result) {
      if (err) {
        return res.json({ error: err });
      } else {
        res.json({ status: result, updated_count: updateCount });
      }
    });
  } catch (error) {
    next(error);
    return;
  }
};
