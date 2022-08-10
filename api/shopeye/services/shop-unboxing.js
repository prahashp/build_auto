/**
 * @name api:shops:services:shopnnboxing
 * @description Shop unboxing Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // models
    ShopUnboxing = require('../models/shops-unboxing');

module.exports.findOne = query => {
    return new bluebird((resolve, reject) => {
        ShopUnboxing.findOne(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.find = query => {
    return new bluebird((resolve, reject) => {
        ShopUnboxing.find(query)
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
        const document = new ShopUnboxing(data)
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
        ShopUnboxing.updateOne(condition, { $set: data })
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
        ShopUnboxing.deleteOne(condition)
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
        ShopUnboxing.updateOne(condition, data, { upsert: true })
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
        ShopUnboxing.aggregate(condition)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.count = query => {
    return new bluebird((resolve, reject) => {
        ShopUnboxing.count(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};