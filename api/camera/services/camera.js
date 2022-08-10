/**
 * @name api_camera_services_camera
 * @description Camera DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Models
    camera = require('.././models/camera');

module.exports.get = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        camera.find(query, fields)
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
        camera.updateOne(query, { $set: record }, {
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

module.exports.deleteOne = query => {
    return new bluebird((resolve, reject) => {
        camera.deleteOne(query)
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
        camera.count(query)
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
        camera.insertMany(record, (err, doc) => {
            if (err)
                reject(err);
            else
                resolve(doc);
        });
    });
};

module.exports.findLimit = (query = {}, offset, limit, fields = {}) => {
    return new bluebird((resolve, reject) => {
        camera.find(query, fields)
            .skip(offset)
            .limit(limit)
            .sort({ updatedAt: -1 })
            .populate({
                path: 'store',
                select: ['name', 'id'],
            })
            .populate({
                path: 'tagging'
            })
            .exec((err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
    });
};

module.exports.find = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        camera.find(query, record).exec((err, doc) => {
            if (err) reject(err);
            else resolve(doc);
        });
    });
};

module.exports.updateMany = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        camera.updateMany(query, { $set: record }, {
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

module.exports.updateTag = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        camera.updateMany(query, { $push: record }, {
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

module.exports.getOne = (query = {}, fields = {}) => {
    return new bluebird((resolve, reject) => {
        camera.findOne(query, fields)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else {
                    resolve(doc);
                }
            });
    });
};

module.exports.aggregate = (query = []) => {
    return new bluebird((resolve, reject) => {
        camera.aggregate(query)
            .exec((err, docs) => {
                if (err)
                    reject(err);
                else
                    resolve(docs);
            });
    });
};

module.exports.update = (query = {}, record = {}) => {
    return new bluebird((resolve, reject) => {
        camera.update(query, { $set: record })
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
        camera.update(query, { $set: record }, { upsert: true, setDefaultsOnInsert: true, multi: true })
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};