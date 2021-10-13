const Village = require("../models/village");
const geolib = require("geolib");

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

  const prepared = allVillages.map((village) => ({
    lat: village.coords[1],
    lon: village.coords[0],
    _id: village._id,
    name: village.name,
  }));

  const orderedVillages = geolib.orderByDistance(campsiteCoords, prepared);
  const closestVillages = orderedVillages.slice(0, 5);

  // maybe use a filter and distance from village instead of fixed number of closest villages in the future

  const closestWithDistances = closestVillages.map((village) => {
    const villageCoords = {lat: village.lat, lon: village.lon}
    const distance =  geolib.getDistance(campsiteCoords, villageCoords)
    return {
      ...village,
      distance
    };
  });
  
  return closestWithDistances;
}

module.exports = getClosestVillages;
