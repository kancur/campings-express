const Fuse = require('./fuse.common.js');
const { getAllCampData } = require('./getMergedSearchData');
const diacritics = require('diacritics');
const FUSE_UPDATE_INTERVAL = 1000 * 30;

const options = {
  includeScore: false,
  includeMatches: false,
  includeRefIndex: false,
  findAllMatches: true,
  minMatchCharLength: 3,
  //location: 0.5,
  //threshold: 0.6,
  // ignoreFieldNorm: false,
  includeScore: true,
  //getFn: getFn,
  keys: [
    {
      name: 'name',
      weight: 1,
    },
    {
      name: 'villages.name',
      weight: 0.5,
    },
  ],
};
const fuse = new Fuse([], options);

let timestamp;
function updateFuseData() {
  getAllCampData()
    .then((data) => fuse.setCollection(data))
    .then(() => timestamp = Date.now());
}
updateFuseData();

module.exports = async function campFuzzySearch(query) {
  if (Date.now() - timestamp > FUSE_UPDATE_INTERVAL) {
    updateFuseData();
  }
  const resultArray = await fuse.search(diacritics.remove(query));
  const sliced = resultArray.slice(0, 10);
  const cleaned = sliced.map(({ item, score }) => ({ ...item, score }));
  return cleaned;
};
