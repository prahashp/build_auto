/**
 * @name api_auth_services_tokens
 * @description Token Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // mongoose model
    token = require('.././models/token');

module.exports.insert = record => {
    return new bluebird((resolve, reject) => {
        const document = new token(record);
        document.save((err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};

module.exports.getOne = query => {
    return new bluebird((resolve, reject) => {
        token.findOne(query)
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'store'
            })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.deleteOne = query => {
    return new bluebird((resolve, reject) => {
        token.deleteOne(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};
