/**
 * @name api:shops:services:shopvideotours
 * @description Shop Video Tours Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // models
    ShopVideoTours = require('../models/shops-video-tour');

module.exports.findOne = query => {
    return new bluebird((resolve, reject) => {
        ShopVideoTours.findOne(query)
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
        ShopVideoTours.find(query)
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
        const document = new ShopVideoTours(data)
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
        ShopVideoTours.updateOne(condition, { $set: data })
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
        ShopVideoTours.deleteOne(condition)
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
        ShopVideoTours.updateOne(condition, data, { upsert: true })
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
        ShopVideoTours.aggregate(condition)
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
        ShopVideoTours.count(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};