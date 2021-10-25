const Village = require("../models/village");
const { closestPoints } = require("./closestPoints");

async function getAllVillagesFromDB() {
  try {
    const data = await Village.find().lean().exec();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getClosestVillages(coords, limit=10, maxDistance) {
  const allVillages = await getAllVillagesFromDB();

  const preparedVillages = allVillages.map((village) => ({
    lat: village.coords[1],
    lon: village.coords[0],
    _id: village._id,
    name: village.name,
    parents: village.parents
  }));

  const ordered = closestPoints(coords, preparedVillages, true, maxDistance);
  const sliced = ordered.slice(0, limit)
  return sliced
}

module.exports = getClosestVillages;
