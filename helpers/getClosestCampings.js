const Camping = require("../models/camping");
const { closestPoints } = require("./closestPoints");
const geolib = require('geolib');

async function getAllCampingsFromDB() {
  try {
    const data = await Camping.find().lean().exec();
    return data;
  } catch (err) {
    console.log(err);
  }
}

let allCampings;
let formatted;

async function getClosestCampings(coords, limit = 10, maxDistance) {
  if (!allCampings) {
    allCampings = await getAllCampingsFromDB();
    formatted = allCampings.map((camp) => ({ ...camp.coords, data: camp }));
  }
  const closest = closestPoints(coords, formatted, true, limit, maxDistance);
  // extracting the original data
  if (closest) {
    return closest.map(({ data, distance }) => ({ ...data, distance }));
  } else {
    return {};
  }
}

async function getCampingsInsidePolygon(polygon) {
  if (!allCampings) {
    allCampings = await getAllCampingsFromDB();
    formatted = allCampings.map((camp) => ({ ...camp.coords, data: camp }));
  }
  const campsInPolygon = allCampings.reduce((totalArray, camp) => {
    const inPolygon = geolib.isPointInPolygon(camp.coords, polygon)
    if (inPolygon) {return [...totalArray, {...camp, distance: 0}]}
    else return totalArray
  },[])

  return campsInPolygon
}

module.exports.getClosestCampings = getClosestCampings;
module.exports.getCampingsInsidePolygon = getCampingsInsidePolygon;

