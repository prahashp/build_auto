/**
 * @name api_auth_services_ticket
 * @description Ticket Database Service
 */

// NPM Modules
const bluebird = require("bluebird"),
  ticket = require("../models/tickets");

module.exports.insert = (record) => {
  return new bluebird((resolve, reject) => {
    const document = new ticket(record);
    document.save((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.getMany = (query = {}, fields = { password: 0 }) => {
  return new bluebird((resolve, reject) => {
    ticket.find(query, fields)
          .exec((err, doc) => {
              if (err)
                  reject(err);
              else
                  resolve(doc);
          });
  });
};

module.exports.findLimit = (query = {}, record = {},offset, limit) => {
  return new bluebird((resolve, reject) => {
    ticket.find(query,record)
    .skip(offset)
    .limit(limit)
    .populate('assignto','name')
    .sort({ updatedAt: -1 })
    .exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.getCount = (query = {}) => {
  return new bluebird((resolve, reject) => {
    ticket.count(query)
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
    ticket.findOne(query, fields)
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
    ticket.updateOne(query, { $set: record })
          .exec((err, doc) => {
              if (err)
                  reject(err);
              else
                  resolve(doc);
          });
  });
};