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
async function getCloseGeomorphologicalUnits(lat, long, radius = 10000) {
  const geoUnits = await getAllGeoUnitsFromDB()
  const campsiteCoords = { latitude: lat, longitude: long };
  const filteredGeoUnits = [];

  geoUnits.forEach((geoUnit) => {
    const flattenedArray = flattenMultiPolygonToSingleArray(geoUnit);
    const reducedSizeArray = getEveryNthElement(flattenedArray, 10);
    
    // parse coords to format expected by geolib library
    const parsedCoords = reducedSizeArray.map(([longitude, latitude]) => ({
      latitude,
      longitude,
    }));

    const closestPoint = geolib.findNearest(campsiteCoords, parsedCoords);
    const distance = geolib.getDistance(campsiteCoords, closestPoint);

    // only return geoMorphoUnits which are within the max distance
    if (distance <= radius) {
      filteredGeoUnits.push({
        uid: geoUnit.properties["@id"],
        name: geoUnit.properties.name,
        distance,
      });
    }
  });

  return filteredGeoUnits;
}

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
