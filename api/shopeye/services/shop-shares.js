/**
 * @name api:shops:services:shopshares
 * @description Shares Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // models
    ShopShares = require('../models/shares');

module.exports.findOne = query => {
    return new bluebird((resolve, reject) => {
        ShopShares.findOne(query)
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
        ShopShares.find(query, fields)
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
        const document = new ShopShares(data)
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
        ShopShares.updateOne(condition, data)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.deleteOne = (condition) => {
    return new bluebird((resolve, reject) => {
        ShopShares.deleteOne(condition)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.deleteMany = (condition) => {
    return new bluebird((resolve, reject) => {
        ShopShares.deleteMany(condition)
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
        ShopShares.updateOne(condition, data, { upsert: true })
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
        ShopShares.aggregate(condition)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
}