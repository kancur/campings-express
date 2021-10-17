const async = require("async");
const GeoUnit = require("../models/geoUnit");
const Village = require("../models/village");

exports.combined_list = async function (req, res, next) {
  try {
    async.parallel(
      {
        villageList: function (callback) {
          Village.find().select("slug name -_id").lean().exec(callback);
        },
        geoUnitList: function (callback) {
          GeoUnit.find().select("_id properties.name properties.natural slug").lean().exec(callback);
        },
      },
      function (err, results) {
        if (err) {
          return next(err);
        }

        const { villageList, geoUnitList } = results;

        const geoCleaned = geoUnitList.map((geounit) => {
          return {
            slug: geounit.slug,
            name: geounit.properties.name,
            type: geounit.properties.natural,
          };
        });

        const villageCleaned = villageList.map((village) => {
          return {
            ...village,
            type: "village"
          }
        })

        const merged = [...villageCleaned, ...geoCleaned];

        res.json(merged);
      }
    );
  } catch (error) {
    next(error);
    return;
  }
};
