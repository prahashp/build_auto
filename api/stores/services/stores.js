/**
 * @name api_stores_services_store
 * @description Stores DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Model
    stores = require('.././models/store');

module.exports.getOne = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        stores.findOne(query, fields)
            .populate({
                path: 'camera'
            })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else {
                    resolve(doc);
                }
            });
    });
};

module.exports.getCount = (query = {}) => {
    return new bluebird((resolve, reject) => {
        stores.count(query)
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
        const document = new stores(record);
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
        stores.updateOne(query, { $set: record })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};

module.exports.getMany = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        stores.find(query, record)
            .sort({ updatedAt: -1 })
            .exec((err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
    });
};

module.exports.findLimit = (query = {}, record = {}, offset, limit) => {
    return new bluebird((resolve, reject) => {
        stores.find(query, record)
            .skip(offset)
            .limit(limit)
            .sort({ updatedAt: -1 })
            .populate({
                path: 'camera'
            })
            .exec((err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
    });
};

module.exports.find = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        stores.find(query, record)
            .sort({ updatedAt: -1 })
            .exec((err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
    });
};

module.exports.getSearchResult = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        stores.find(query, record).exec((err, doc) => {
            if (err) reject(err);
            else resolve(doc);
        });
    });
};

module.exports.deleteOne = query => {
    return new bluebird((resolve, reject) => {
        stores.deleteOne(query)
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
        stores.insertMany(records)
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
        stores.update(query, { $set: record })
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
        stores.updateOne(query, { $set: record }, { upsert: true, setDefaultsOnInsert: true })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};