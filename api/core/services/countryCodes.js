/**
 * @name api_countryCodes_services_store
 * @description countryCodes DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Model
    countryCodes = require('../models/countryCodes');

module.exports.getOne = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        countryCodes.findOne(query, fields)
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
        countryCodes.count(query)
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
        const document = new countryCodes(record);
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
        countryCodes.updateOne(query, { $set: record })
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
    countryCodes.find(query,record).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.findLimit = (query = {}, record = {},offset, limit) => {
  return new bluebird((resolve, reject) => {
    countryCodes.find(query,record).skip(offset).limit(limit).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.find = (query = {}, record = {}) => {
  return new bluebird((resolve, reject) => {
    countryCodes.find(query,record).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};
