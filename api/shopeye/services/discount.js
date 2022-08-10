/**
 * @name api:shops:services:discount
 * @description Discount Service
 */

// NPM Modules
const bluebird = require('bluebird'),

Discount = require('.././models/discount');

module.exports.create = (data) => {
    return new bluebird((resolve, reject) => {
        const document = new Discount(data)
        document.save((err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};

module.exports.find = (query, limit = 20, offset = 0, fields = {}) => {
    return new bluebird((resolve, reject) => {
        Discount.find(query, fields)
            .sort({ _id: -1 })
            .skip(offset)
            .limit(limit)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.findOne = query => {
    return new bluebird((resolve, reject) => {
        Discount.findOne(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.update = (query, record) => {
    return new bluebird((resolve, reject) => {
        Discount.updateOne(query, { $set: record })
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
        Discount.count(query)
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
        Discount.deleteOne(condition)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};