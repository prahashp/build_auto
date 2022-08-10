/**
 * @name api_subscription_services
 * @description Subscription DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Models
    subscription = require('../models/subscription');

module.exports.insert = record => {
    return new bluebird((resolve, reject) => {
        const document = new subscription(record);
        document.save((err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};

module.exports.get = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        subscription.find(query, fields)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.updateOne = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        subscription.updateOne(query, { $set: record }, {
            upsert: true,
            setDefaultsOnInsert: true
        })
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
        subscription.count(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.findLimit = (query = {}, record = {}, offset, limit) => {
    return new bluebird((resolve, reject) => {
        subscription.find(query, record).skip(offset).limit(limit).sort({ updatedAt: -1 })
            .exec((err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
    });
};