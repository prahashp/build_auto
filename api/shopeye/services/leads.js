/**
 * @name api:shops:services:leads
 * @description Leads Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    orders = require('.././models/orders');

module.exports.getCustomersCount = query => {
    return new bluebird((resolve, reject) => {
        orders.distinct('customer.mobile', query)
            .exec((err, docs) => {
                if (err)
                    reject(err);
                else
                    resolve(docs);
            });
    });
};

module.exports.getOrdersCount = (query = {}) => {
    return new bluebird((resolve, reject) => {
        orders.count(query)
            .exec((err, docs) => {
                if (err)
                    reject(err);
                else
                    resolve(docs);
            });
    });
};

module.exports.getOrders = (query = {}) => {
    return new bluebird((resolve, reject) => {
        orders.find(query)
            .exec((err, docs) => {
                if (err)
                    reject(err);
                else
                    resolve(docs);
            });
    });
};