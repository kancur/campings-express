const testLib = require("../helpers/getClosestVillage");
const { body, validationResult } = require("express-validator");
const validationResultHandlerMiddleware = require("../middleware/validationResultHanderMiddleware");
const closestVillageMiddleware = require("../middleware/closestVillageMiddleware");

exports.camping_get = async function (req, res, next) {
  const response = await testLib.test();
  res.json({ response });
};

exports.camping_post = [
  body("name", "name must be longer than 3 chars (camp name)").trim().isLength({ min: 3 }).escape(),
  body("lat", "lat must be a numeric value (latitude)").trim().isNumeric().escape(),
  body("long", "long must be a numeric value (longitude)").trim().isNumeric().escape(),
  
  //custom middleware
  validationResultHandlerMiddleware,
  
  // get closest village for lat long
  closestVillageMiddleware,

  (req, res, next) => {
    res.json({ closest_village: res.locals.closestVillage  });
  }

];
