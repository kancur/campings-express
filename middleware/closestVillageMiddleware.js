const getClosestVillage = require("../helpers/getClosestVillage")

module.exports = async function closestVillageMiddleware(req, res, next) {
  const lat = req.body.lat
  const lon = req.body.lon

  const closestVillage = await getClosestVillage(lat, lon)

  res.locals.closestVillage = closestVillage

  next()
}