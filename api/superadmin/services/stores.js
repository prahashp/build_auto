/**
 * @name api_stores_services_store
 * @description Stores DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Model
    stores = require('../../stores/models/store');

module.exports.getOne = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        stores.findOne(query, fields)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getCount = (query = {}) => {
    return new bluebird((resolve, reject) => {
        stores.count(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.insert = record => {
    return new bluebird((resolve, reject) => {
        const document = new stores(record);
        document.save((err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};

module.exports.updateOne = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        stores.updateOne(query, { $set: record })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getMany = (query = {}, record = {}) => {
  return new bluebird((resolve, reject) => {
    stores.find(query,record).sort({updatedAt: -1 }).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};
