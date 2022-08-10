/**
 * @name api_timezones_services_store
 * @description timezones DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Model
    timezones = require('../../core/models/timezones');

module.exports.getOne = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        timezones.findOne(query, fields)
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
        timezones.count(query)
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
        const document = new timezones(record);
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
        timezones.updateOne(query, { $set: record })
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
    timezones.find(query,record).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.findLimit = (query = {}, record = {},offset, limit) => {
  return new bluebird((resolve, reject) => {
    timezones.find(query,record).skip(offset).limit(limit).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.find = (query = {}, record = {}) => {
  return new bluebird((resolve, reject) => {
    timezones.find(query,record).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};
