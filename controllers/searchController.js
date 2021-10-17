const Village = require('../models/village')
const fuzzySearch = require('../helpers/fuzzySearch')

exports.search_get = async function (req, res, next) {
  if (!req.query.q) {
    return next(new Error('search query not defined'))
  }

  // doesn't work for partial match
  //const data = await Village.find({ $text: { $search: `"${req.query.q}"` }});
  const searchResultsArray = await fuzzySearch(req.query.q)

  try {
    res.json(searchResultsArray);
  } catch (error) {
    next(error);
    return;
  }
}