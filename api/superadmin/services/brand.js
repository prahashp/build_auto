/**
 * @name api_auth_services_brand
 * @description brand Database Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // mongoose model
    brand = require('../models/brand');

module.exports.getMany = (query = {}, fields = { password: 0 }) => {
    return new bluebird((resolve, reject) => {
        brand.find(query, fields)
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
        brand.findOne(query, fields)
            .populate('userId','name')
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getConfig = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        brand.findOne(query, fields)
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
        const document = new brand(record);
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
        brand.updateOne(query, { $set: record })
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
        brand.count(query)
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
        brand.find(query,record)
        .skip(offset)
        .limit(limit)
        .populate('userId','name')
        .sort({updatedAt: -1 })
        .exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    }); 
};