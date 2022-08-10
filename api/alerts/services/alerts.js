/**
 * @name api_alerts_services
 * @description Alerts DB Services
 */

// NPM Modules
const bluebird = require('bluebird'),

    // mongoose model
    alerts = require('.././models/alerts');

module.exports.insert = record => {
    return new bluebird((resolve, reject) => {
        const document = new alerts(record);
        document.save((err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};

module.exports.getCount = (query = {}) => {
    return new bluebird((resolve, reject) => {
        alerts.count(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.find = (query = {}, fields = {}, offset = 0, limit = 0) => {
    return new bluebird((resolve, reject) => {
        alerts.find(query, fields)
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};