const geolib = require("geolib");
const geoUnit = require("../models/geoUnit");

async function getAllGeoUnitsFromDB() {
  try {
    const data = await geoUnit.find().lean().exec();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// returns a list of geomorphological units withing radius
module.exports = async function getCloseGeomorphologicalUnits(lat, lon, radius = 10000) {
  const geoUnits = await getAllGeoUnitsFromDB();
  const campsiteCoords = { lat, lon };
  const filteredGeoUnits = [];

  geoUnits.forEach((geoUnit) => {
    const flattenedArray = flattenMultiPolygonToSingleArray(geoUnit);
    const reducedSizeArray = getEveryNthElement(flattenedArray, 10);

    const isInPolygon = geolib.isPointInPolygon(campsiteCoords, reducedSizeArray);

    if (isInPolygon) {
      filteredGeoUnits.push(formatGeoUnits(geoUnit));
    } else {
      const closestPoint = geolib.findNearest(campsiteCoords, reducedSizeArray);
      const distance = geolib.getDistance(campsiteCoords, closestPoint);

      // only return geoMorphoUnits which are within the max distance
      if (distance <= radius) {
        filteredGeoUnits.push(formatGeoUnits(geoUnit, distance));
      }
    }
  });

  return filteredGeoUnits;
};

function flattenMultiPolygonToSingleArray(geoUnit) {
  if (geoUnit.geometry.type == "MultiPolygon") {
    return geoUnit.geometry.coordinates[0].flat();
  }
  return geoUnit.geometry.coordinates[0];
}

function getEveryNthElement(array, factor = 4) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i % factor === 0) {
      newArray.push(array[i]);
    }
  }
  return newArray;
}

function formatGeoUnits(geoUnit, distance = 0) {
  return {
    _id: geoUnit._id,
    uid: geoUnit.properties["@id"],
    name: geoUnit.properties.name,
    distance,
  };
}
