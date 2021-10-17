const Village = require("../models/village");
const GeoUnit = require("../models/geoUnit");

let searchData = null;

async function getMergedSearchData() {
  if (!searchData) {
    const villageData = await getVillageData();
    const geoData = await getGeoData();
    searchData = [...villageData, ...geoData];
  }
  return searchData;
}

async function getVillageData() {
  const villageData = await Village.find().select("slug name -_id parents.county_name").lean();
  const withType = villageData.map(({parents, ...village}) => {
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
  const flattened = data.map(({ slug, properties }) => ({ slug, name: properties.name, type: properties.natural }));
  return flattened;
}

module.exports.getMergedSearchData = getMergedSearchData;
