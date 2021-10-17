const Village = require("../models/village");
const { closestPoints } = require("./closestPoints");

// only return villages closer than max distance (in meters)
MAX_DISTANCE_FROM_VILLAGE = 20000;

async function getAllVillagesFromDB() {
  try {
    const data = await Village.find().lean().exec();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getClosestVillages(lat, lon) {
  const allVillages = await getAllVillagesFromDB();
  const campsiteCoords = { lat, lon };

  const preparedVillages = allVillages.map((village) => ({
    lat: village.coords[1],
    lon: village.coords[0],
    _id: village._id,
    name: village.name,
  }));

  return closestPoints(campsiteCoords, preparedVillages, true, 5, MAX_DISTANCE_FROM_VILLAGE);
}

module.exports = getClosestVillages;
