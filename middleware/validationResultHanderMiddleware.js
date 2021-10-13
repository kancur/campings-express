const { validationResult } = require("express-validator");

module.exports = function validationResultsHandler(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400)
      .json({ ...errors });
    return;
  } else {
    next();
  }
}