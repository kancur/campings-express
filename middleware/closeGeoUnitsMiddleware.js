const getCloseGeoUnits = require("../helpers/getCloseGeoUnits")

module.exports = async function closeGeoUnitsMiddleware(req, res, next) {
  const lat = req.body.lat
  const lon = req.body.lon

  const closeGeoUnits = await getCloseGeoUnits(lat, lon)
  console.log(closeGeoUnits)
  res.locals.closeGeoUnits = closeGeoUnits

  next()
}