/**
 * @name api:shops:services:shopproducts
 * @description Shop Products Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // models
    ShopProducts = require('../models/shops-product');

module.exports.findOne = query => {
    return new bluebird((resolve, reject) => {
        ShopProducts.findOne(query)
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
        ShopProducts.find(query, fields)
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
        const document = new ShopProducts(data)
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
        ShopProducts.updateOne(condition, { $set: data })
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
        ShopProducts.deleteOne(condition)
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
        ShopProducts.updateOne(condition, data, { upsert: true })
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
        ShopProducts.aggregate(condition)
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
        ShopProducts.count(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};