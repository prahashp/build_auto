/**
 * @name api:shops:services:orders
 * @description Orders Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    Orders = require('.././models/orders');

module.exports.create = (data) => {
    return new bluebird((resolve, reject) => {
        const document = new Orders(data)
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
        Orders.find(query, fields)
            .sort({ _id: -1 })
            .skip(offset)
            .limit(limit)
            .populate({
                path: 'shop',
                select: 'mobile companyName location'
            })
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
        Orders.findOne(query)
            .populate({
                path: 'shop',
                select: 'mobile companyName location'
            })
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
        Orders.updateOne(query, { $set: record })
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
        Orders.count(query)
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
        Orders.aggregate(condition)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
}