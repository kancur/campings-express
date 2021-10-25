const Camping = require("../models/camping");
const { closestPoints } = require("./closestPoints");

async function getAllCampingsFromDB() {
  try {
    const data = await Camping.find().lean().exec();
    return data;
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {Object} coords
 * @param {Number} coords.lat - Latitude in xx.xxxxxxx format
 * @param {Number} coords.lon - Longitude in xx.xxxxxxx format
 * @returns
 */
async function getCloseCampings(coords, limit = 10, maxDistance) {
  const allCampings = await getAllCampingsFromDB();

  // closestPoints function needs lat lon coordinates to be at the top of object (not nested)
  const formatted = allCampings.map((camp) => ({ ...camp.coords, data: camp }));
  const closest = closestPoints(coords, formatted, true, limit, maxDistance);
  // extracting the original data
  console.log("closest ------>",closest)
  if (closest) {
    return closest.map(({data, distance}) => ({...data, distance}))
  } else {
    return {}
  }
  
}

module.exports = getCloseCampings;
