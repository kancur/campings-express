const getClosestVillages = require('../helpers/getClosestVillages');

module.exports = async function closestVillageMiddleware(req, res, next) {
  //const { lat, lon } = req.body.coords;
  const closestVillages = await getClosestVillages(req.body.coords, 5);
  res.locals.closestVillages = closestVillages;

  next();
};
