const getClosestVillages = require("../helpers/getClosestVillages")

module.exports = async function closestVillageMiddleware(req, res, next) {
  const lat = req.body.lat
  const lon = req.body.lon

  const closestVillages = await getClosestVillages(lat, lon)

  res.locals.closestVillages = closestVillages

  next()
}