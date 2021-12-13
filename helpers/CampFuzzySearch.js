const Fuse = require('./fuse.common.js');
const { getAllCampData } = require('./getMergedSearchData');
const diacritics = require('diacritics');

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

function updateFuseData() {
  getAllCampData()
    .then((data) => fuse.setCollection(data))
}
updateFuseData();

module.exports = async function campFuzzySearch(query) {
  const resultArray = await fuse.search(diacritics.remove(query));
  const sliced = resultArray.slice(0, 10);
  const cleaned = sliced.map(({ item, score }) => ({ ...item, score }));
  return cleaned;
};
