/**
 * @name api_auth_services_user
 * @description User Database Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // mongoose model
    user = require('../../users/models/user');

module.exports.getMany = (query = {}, fields = { password: 0 }) => {
    return new bluebird((resolve, reject) => {
        user.find(query, fields)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getOne = (query = {}, fields = { password: 0 }) => {
    return new bluebird((resolve, reject) => {
        user.findOne(query, fields)
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
        const document = new user(record);
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
        user.updateOne(query, { $set: record })
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
        user.count(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.findLimit = (query = {}, record = {},offset, limit) => {
    return new bluebird((resolve, reject) => {
        user.find(query,record).skip(offset).limit(limit).sort({updatedAt: -1 }).exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  };

module.exports.findwithoutLimit = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        user.find(query,record).sort({updatedAt: -1 }).exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  };