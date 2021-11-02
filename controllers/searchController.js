const fulltextCampFuzzySearch = require('../helpers/CampFuzzySearch');
const fuzzySearch = require('../helpers/fuzzySearch')

exports.search_get = async function (req, res, next) {
  if (!req.query.q) {
    return next(new Error('search query not defined'))
  }

  const searchResultsArray = await fuzzySearch(req.query.q)

  try {
    res.json(searchResultsArray);
  } catch (error) {
    next(error);
    return;
  }
}

exports.fulltext_camp_search = async function (req, res, next) {
  if (!req.query.q) {
    return next(new Error('search query not defined'))
  }
  
  if (req.query.q.length < 3){
    return next(new Error('please use atleast 3 characters for search to work'))
  }
  const searchResultsArray = await fulltextCampFuzzySearch(req.query.q)

  try {
    res.json(searchResultsArray);
  } catch (error) {
    next(error);
    return;
  }
}