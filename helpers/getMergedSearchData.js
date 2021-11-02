const Village = require("../models/village");
const GeoUnit = require("../models/geoUnit");
const Camping = require("../models/camping");

let searchData = null;

async function getMergedSearchData() {
  if (!searchData) {
    const villageData = await getVillageData();
    const geoData = await getGeoData();
    const campData = await getCampData();
    searchData = [...villageData, ...geoData, ...campData];
  }
  return searchData;
}

async function getVillageData() {
  const villageData = await Village.find().select("slug name -_id parents.county_name").lean();
  const withType = villageData.map(({ parents, ...village }) => {
    return {
      ...village,
      county_name: parents?.county_name,
      type: "village",
    };
  });
  return withType;
}

async function getGeoData() {
  const data = await GeoUnit.find().select("properties.name properties.natural slug -_id").lean();
  // flattens the array and matches the format of {slug, type, name}
  const flattened = data.map(({ slug, properties }) => ({
    slug,
    name: properties.name,
    type: properties.natural,
  }));
  return flattened;
}

async function getCampData() {
  const data = await Camping.find().select("name villages slug -_id").lean();
  const parsed = data.map((camp) => {
    const result = {
      name: camp.name,
      slug: camp.slug,
      type: "camp",
    };
    if (camp.villages) {
      result.closest_village_name = camp.villages[0].name;
      result.county_name = camp.villages[0].parents.county_name;
    }

    return result;
  });
  return parsed;
}

async function getAllCampData() {
  const data = await Camping.find().lean();
  return data
}

module.exports.getMergedSearchData = getMergedSearchData;
module.exports.getAllCampData = getAllCampData