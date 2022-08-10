/**
 * @name api_tickets_services
 * @description Tickets DB Service
 */

// NPM Modules
const bluebird = require('bluebird'),

    // Mongoose Models
    ticketDetails = require('../models/ticketdetails');

module.exports.insert = record => {
    return new bluebird((resolve, reject) => {
        const document = new ticketDetails(record);
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
        ticketDetails.find(query, fields)
            .populate('fromId','name')
            .populate('toId','name')
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
        ticketDetails.updateOne(query, { $set: record }, {
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
        ticketDetails.count(query)
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
        ticketDetails.find(query, record)
            .skip(offset)
            .limit(limit)
            .sort({ updatedAt: -1 })
            .exec((err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
    });
};