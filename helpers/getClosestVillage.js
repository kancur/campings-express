const Village = require("../models/village");
const Camping = require("../models/camping");
const geolib = require("geolib");

async function getAllVillagesFromDB() {
  try {
    const data = await Village.find().lean().exec();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getClosestVillage(lat, long) {
  const allVillages = await getAllVillagesFromDB();
  let lowestDistance = 99999999;
  let closestVillage = {};

  allVillages.map((village) => {
    const campsiteCoords = { latitude: Number(lat), longitude: Number(long) };
    const villageCoords = {
      latitude: village.coords[1],
      longitude: village.coords[0],
    };

    const distance = geolib.getDistance(campsiteCoords, villageCoords);
    console.log(distance);
    if (distance < lowestDistance) {
      lowestDistance = distance;
      closestVillage = {
        uid: village["uid"],
        name: village.name,
        distance,
      };
    }
  });
  return closestVillage;
}

module.exports = getClosestVillage;
