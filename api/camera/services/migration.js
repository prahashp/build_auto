// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Models
    ips = require('.././models/migration-ip'),
    apiKeys = require('.././models/migration-api-key');

module.exports.getIp = (query = {}) => {
    return new bluebird((resolve, reject) => {
        ips.findOne(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getApiKey = (query = {}) => {
    return new bluebird((resolve, reject) => {
        apiKeys.findOne(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};