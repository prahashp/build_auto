/**
 * @name api_tickets_services
 * @description Tickets DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Models
    tickets = require('../models/tickets');

module.exports.insert = record => {
    return new bluebird((resolve, reject) => {
        const document = new tickets(record);
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
        tickets.find(query, fields)
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
        tickets.updateOne(query, { $set: record }, {
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
        tickets.count(query)
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
        tickets.find(query, record)
            .populate('assignTo', 'name')
            .populate('from', 'name')
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
        tickets.findOne(query, fields)
            .exec((err, doc) => {
                if (err)
                    reject(err);
                else
                    resolve(doc);
            });
    });
};