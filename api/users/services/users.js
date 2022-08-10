/**
 * @name api_auth_services_user
 * @description User Database Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // mongoose model
    user = require('../models/user');

module.exports.getMany = (query = {}, fields = { password: 0 }) => {
    return new bluebird((resolve, reject) => {
        user.find(query, fields)
            .populate('stores')
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getOne = (query = {}, fields = { password: 0 }) => {
    return new bluebird((resolve, reject) => {
        user.findOne(query, fields)
            .populate('groups', 'stores')
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.insert = record => {
    return new bluebird((resolve, reject) => {
        const document = new user(record);
        document.save((err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};

module.exports.updateOne = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        user.updateOne(query, { $set: record })
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
        user.count(query)
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
        user.find(query, record).skip(offset).limit(limit).sort({ updatedAt: -1 })
            .populate('groups', 'stores')
            .exec((err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
    });
};

module.exports.findWithoutLimit = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        user.find(query, record).sort({ updatedAt: -1 }).exec((err, doc) => {
            if (err) reject(err);
            else resolve(doc);
        });
    });
};

module.exports.findOne = query => {
    return new bluebird((resolve, reject) => {
        user.findOne(query, { password: 0 })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getSearchResult = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        user.find(query, record).exec((err, doc) => {
            if (err) reject(err);
            else resolve(doc);
        });
    });
};

module.exports.deleteOne = query => {
    return new bluebird((resolve, reject) => {
        user.deleteOne(query)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.insertMany = records => {
    return new bluebird((resolve, reject) => {
        user.insertMany(records)
            .then(docs => {
                resolve(docs);
            })
            .catch(error => {
                reject(error);
            })
    });
};

module.exports.update = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        user.update(query, { $set: record })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.upsert = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        user.updateOne(query, { $set: record }, { upsert: true, setDefaultsOnInsert: true })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.find = (query = {}, fields = { password: 0 }) => {
    return new bluebird((resolve, reject) => {
        user.find(query, fields)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};