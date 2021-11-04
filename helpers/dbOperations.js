const getClosestCampings = require("../helpers/getClosestCampings");
const toSlug = require("../helpers/toSlug");

// Model instance must have coords property at the top level
module.exports.prepareCloseCampingsBulkOp = async function updateCloseCampings(Model) {
  let updateCount = 0;
  const instancesArray = await Model.find().lean();
  const bulkOperation = Model.collection.initializeUnorderedBulkOp();

  for (const instance of instancesArray) {
    const closeCampings = await getClosestCampings(instance.coords, 10);
    const idsOfCloseCampings = closeCampings.map((camp) => camp._id);
    bulkOperation.find({ _id: instance._id }).updateOne({ $set: { campings: idsOfCloseCampings } });

    updateCount += 1;
    if (updateCount % 10 === 0) {
      console.log("updating:", updateCount);
    }
  }

  return bulkOperation;
};

// the model has to have "name" field at the top level
module.exports.prepareSlugBulkOp = async function updateSlugs(Model, forceUpdate = false) {
  const instances = await Model.find().lean();

  const usedSlugs = forceUpdate ? [] : instances.map((instance) => instance.slug || "");

  let hadSlugCount = 0;
  let calculatedSlugCount = 0;
  var bulkOperation = Model.collection.initializeUnorderedBulkOp();

  for (const instance of instances) {
    const hasSlug = !!instance.slug;
    if ((!hasSlug && instance?.name) || forceUpdate) {
      let autogenSlug = toSlug(instance.name);
      if (usedSlugs.includes(autogenSlug)) {
        autogenSlug = `vn-${autogenSlug}`; //vn = vodna nadrz
        console.log("duplicate slug fixed", autogenSlug);
      }
      usedSlugs.push(autogenSlug);
      bulkOperation.find({ _id: instance._id }).updateOne({ $set: { slug: autogenSlug } });
      calculatedSlugCount += 1;
    } else {
      hadSlugCount += 1;
    }
  }
  console.log({ had_slug_count: hadSlugCount, slug_calculated_count: calculatedSlugCount });
  return bulkOperation;
};
