
module.exports = async function closeGeoUnits(req, res, next) {
  const lat = req.body.lat
  const long = req.body.long

  const closeGeoUnits = await getClosestVillage(lat, long)

  res.locals.closeGeoUnits = closeGeoUnits

  next()
}