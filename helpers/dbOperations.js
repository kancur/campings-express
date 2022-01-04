const { getClosestCampings, getCampingsInsidePolygon } = require("../helpers/getClosestCampings");
const toSlug = require("../helpers/toSlug");
const geolib = require("geolib");
const { flattenMultiPolygonToSingleArray } = require("./flattenMultiPolygonGeounit");

const MIN_NR_OF_CAMPS = 10;

// Model instance must have coords property at the top level
module.exports.prepareCloseCampingsBulkOp = async function updateCloseCampings(Model) {
  console.log('preparing bulk op')
  const instancesArray = await Model.find().lean();
  const bulkOperation = Model.collection.initializeUnorderedBulkOp();
  for (const instance of instancesArray) {
    let closeCampings = [];
    if (instance?.coords) {
      closeCampings = await getClosestCampings(instance.coords, MIN_NR_OF_CAMPS);
    } else {
      closeCampings = await getCloseCampingsForGeounit(instance)
    }
    const idsOfCloseCampings = closeCampings.map((camp) => camp._id);
    bulkOperation.find({ _id: instance._id }).updateOne({ $set: { campings: idsOfCloseCampings } });
  }
  return bulkOperation;
};

// the model has to have "name" field at the top level
module.exports.prepareSlugBulkOp = async function updateSlugs(Model, forceUpdate = false) {
  const instances = await Model.find().lean();

  const usedSlugs = forceUpdate ? [] : instances.map((instance) => instance.slug || "");

  let hadSlugCount = 0;
  let calculatedSlugCount = 0;
  const bulkOperation = Model.collection.initializeUnorderedBulkOp();

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

async function getCloseCampingsForGeounit(instance) {
  let closecamps = []
  const instanceCoordsArray = flattenMultiPolygonToSingleArray(instance);
  const campsInPolygon = await getCampingsInsidePolygon(instanceCoordsArray);
  if (campsInPolygon.length > 0) {
    closecamps.push(...campsInPolygon);
  }
  console.log("---- camps in polygon:", campsInPolygon.length);
  if (campsInPolygon.length < MIN_NR_OF_CAMPS) {
    const centerPoint = geolib.getCenter(instanceCoordsArray);
    const campsNearCenterPoint = await getClosestCampings(centerPoint, 100);

    for (let i = 0; i < MIN_NR_OF_CAMPS - campsInPolygon.length; i++) {
      const wasAlreadyUsed = closecamps.find((polygonCamp) => polygonCamp.name === campsNearCenterPoint[i].name)
      if (wasAlreadyUsed) {
        continue
      }
      closecamps.push(campsNearCenterPoint[i]);
    }
  }
  return closecamps
}
