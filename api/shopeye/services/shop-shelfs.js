/**
 * @name api:shops:services:shopracks
 * @description Shop Users Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // models
    ShopRacks = require('../models/shops-shelf');

module.exports.findOne = query => {
    return new bluebird((resolve, reject) => {
        ShopRacks.findOne(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.find = (query, fields = {}) => {
    return new bluebird((resolve, reject) => {
        ShopRacks.find(query, fields)
            .sort({'createdAt': -1})
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.create = (data) => {
    return new bluebird((resolve, reject) => {
        const document = new ShopRacks(data)
        document.save((err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};

module.exports.updateOne = (condition, data) => {
    return new bluebird((resolve, reject) => {
        ShopRacks.updateOne(condition, data)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.deleteOne = (condition, data) => {
    return new bluebird((resolve, reject) => {
        ShopRacks.deleteOne(condition)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.upsert = (condition, data) => {
    return new bluebird((resolve, reject) => {
        ShopRacks.updateOne(condition, data, { upsert: true })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.aggregate = function (condition) {
    return new bluebird((resolve, reject) => {
        ShopRacks.aggregate(condition)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
}