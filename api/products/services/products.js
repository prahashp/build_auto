/**
 * @name api_products_services
 * @description Products DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Models
    products = require('../models/products');

module.exports.insert = record => {
    return new bluebird((resolve, reject) => {
        const document = new products(record);
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
        products.find(query, fields)
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
        products.updateOne(query, { $set: record }, {
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
        products.count(query)
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
        products.find(query, record)
            .skip(offset)
            .limit(limit)
            .sort({ updatedAt: -1 })
            .exec((err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
    });
};

module.exports.getOne = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        products.findOne(query, fields)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.find = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        products.find(query, record)
            .sort({ updatedAt: -1 })
            .exec((err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
    });
};