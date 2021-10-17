const geolib = require("geolib");

/**
 *
 * @param {Object} placeCoords - The object with gps coordinates
 * @param {Number} placeCoords.lat - Latitude in xx.xxxxxx format
 * @param {Number} placeCoords.lon - Longitude in xx.xxxxxx format
 * @param {Object[]} arrayOfPointObj - Array of objects with gps coordinates
 * @param {Number} arrayOfPointObj[].lat - Latitude in xx.xxxxxx format
 * @param {Number} arrayOfPointObj[].lon - Longitude in xx.xxxxxx format
 * @param {Boolean} calculateDistance - Whether to calculate distances
 * @param {Number} maxReturn - Max amount of results to return
 * @param {Number} maxDistance - Limit results by maximmum distance in meters
 */
function getClosePoints(
  placeCoords,
  arrayOfPointObj,
  calculateDistance = false,
  maxReturn = 1000000,
  maxDistance
) {
  const orderedPoints = geolib.orderByDistance(placeCoords, arrayOfPointObj);
  const closestPoints = orderedPoints.slice(0, maxReturn);

  if (calculateDistance) {
    const closestWithDistances = closestPoints.map((point) => {
      const pointCoords = { lat: point.lat, lon: point.lon };
      const distance = geolib.getDistance(placeCoords, pointCoords);
      // maxDistanceFilter
      if (maxDistance) {
        if (distance <= maxDistance) {
          return {
            ...point,
            distance,
          };
        }
      } else {
        return {
          ...point,
          distance,
        };
      }
    });
    console.log(closestWithDistances);

    return closestWithDistances;
  }
  return closestPoints;
}
exports.closestPoints = getClosePoints;
