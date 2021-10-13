const getClosestVillage = require("../helpers/getClosestVillage")

module.exports = async function closestVillageMiddleware(req, res, next) {
  const lat = req.body.lat
  const long = req.body.long

  const closestVillage = await getClosestVillage(lat, long)

  res.locals.closestVillage = closestVillage

  next()
}