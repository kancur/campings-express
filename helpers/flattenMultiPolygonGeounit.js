function flattenMultiPolygonToSingleArray(geoUnit) {
  if (geoUnit.geometry.type == "MultiPolygon") {
    return geoUnit.geometry.coordinates[0].flat();
  }
  return geoUnit.geometry.coordinates[0];
}
exports.flattenMultiPolygonToSingleArray = flattenMultiPolygonToSingleArray;
