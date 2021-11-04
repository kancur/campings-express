const Fuse = require('./fuse.common.js')
const { getMergedSearchData } = require('../helpers/getMergedSearchData')
const diacritics = require('diacritics')

function getFn() {
  const value =  Fuse.config.getFn.apply(this, arguments)
  const cleaned = diacritics.remove(value.toLowerCase())
  return cleaned;
}

const options = {
  includeScore: false,
  includeMatches: false,
  includeRefIndex: false,
   findAllMatches: true,
  // minMatchCharLength: 1,
  threshold: 0.25,
  // ignoreFieldNorm: false,
  getFn: getFn,
  keys: [
    "name",
  ]
};

const fuse = new Fuse([], options)


getMergedSearchData()
  .then((data) => fuse.setCollection(data))

module.exports = async function fuzzySearch(query) {
  const resultArray = await fuse.search(diacritics.remove(query))
  const sliced = resultArray.slice(0,10)
  const cleaned = sliced.map(({item, score}) => ({...item, score}))
  return cleaned
}