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
async function getCloseCampings(coords) {
  const allCampings = await getAllCampingsFromDB();

  return closestPoints(coords, allCampings, true , 10);
}

module.exports = getCloseCampings;
