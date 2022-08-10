/**
 * @name api_stores_services_dashboard
 * @description dashboard DB Service
 */
const bluebird = require("bluebird");

const storeConfig = require(".././models/storeConfig");

module.exports.findOne = (query) => {
  return new bluebird((resolve, reject) => {
    storeConfig
      .findOne(query, { _id: 0, createdAt: 0, updatedAt: 0, active: 0,edgeAppToken:0 })
      .populate({
          path:'store',
          select:'-edgeAppToken'
      })
      .exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
  });
};
