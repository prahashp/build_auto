/**
 * @name api_stores_services_store
 * @description Stores DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Model
    groups = require('../models/group');

module.exports.getOne = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        groups.findOne(query, fields)
        .populate('stores','name')
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getOne_details = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        groups.findOne(query, fields)
            .populate('stores','name')
            .populate('users','name')
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
        groups.count(query)
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
        const document = new groups(record);
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
        groups.updateOne(query, { $set: record })
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
    groups.find(query,record).sort({ updatedAt: -1 }).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.findLimit = (query = {}, record = {},offset, limit) => {
  return new bluebird((resolve, reject) => {
    groups.find(query,record)
    .populate('stores','name')
    .populate('users','name')
    .skip(offset)
    .limit(limit)
    .sort({updatedAt: -1 })
    .exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.findLimit_details = (query = {}, record = {}) => {
  return new bluebird((resolve, reject) => {
    groups.find(query,record)
    .populate('stores','name')
    .populate('users','name')
    .exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.find = (query = {}, record = {}) => {
  return new bluebird((resolve, reject) => {
    groups.find(query,record).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};
