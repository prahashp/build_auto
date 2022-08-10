/**
 * @name api:shops:services:shopusers
 * @description Shop Users Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // models
    ShopUsers = require('.././models/shops-users');

module.exports.findOne = (query) => {
    return new bluebird((resolve, reject) => {
        ShopUsers.findOne(query, { password: 0 }) //otp:0
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
        const document = new ShopUsers(data)
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
        ShopUsers.updateOne(condition, data)
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
        ShopUsers.updateOne(condition, data, { upsert: true })
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
        ShopUsers.aggregate(condition)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
}

module.exports.count = query => {
    return new bluebird((resolve, reject) => {
        ShopUsers.count(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.find = (query, limit = 20, offset = 0, fields = {}) => {
    return new bluebird((resolve, reject) => {
        ShopUsers.find(query, fields)
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

module.exports.insertMany = record => {
    return new bluebird((resolve, reject) => {
        ShopUsers.insertMany(record, (err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};