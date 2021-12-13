const Fuse = require('./fuse.common.js');
const { getMergedSearchData } = require('../helpers/getMergedSearchData');
const diacritics = require('diacritics');
const FUSE_UPDATE_INTERVAL = 1000 * 30;

function getFn() {
  const value = Fuse.config.getFn.apply(this, arguments);
  const cleaned = diacritics.remove(value.toLowerCase());
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
  keys: ['name'],
};

const fuse = new Fuse([], options);

let timestamp;
function updateFuse() {
  getMergedSearchData()
    .then((data) => fuse.setCollection(data))
    .then(() => timestamp = Date.now());
}
updateFuse();

module.exports = async function fuzzySearch(query) {
  if (Date.now() - timestamp > FUSE_UPDATE_INTERVAL) {
    updateFuse();
  }
  const resultArray = await fuse.search(diacritics.remove(query));
  const sliced = resultArray.slice(0, 10);
  const cleaned = sliced.map(({ item, score }) => ({ ...item, score }));
  return cleaned;
};
