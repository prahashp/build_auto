/**
 * @name api_edgeapp_services
 * @description Edgeapp Service
 */

// NPM Modules
const bluebird = require("bluebird"),
  //Mongoose Models
  edgeapp = require(".././models/edgeapp"),
  logs = require(".././models/logs"),
  stores = require("../../stores/models/store"),
  commonlogs=require('../../edge-app/models/commonlogs');

module.exports.get = (query = {}, fields = {}) => {
  return new bluebird((resolve, reject) => {
    edgeapp.find(query, fields).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.get_ip = (query = {}, fields = {}) => {
  return new bluebird((resolve, reject) => {
    logs.find(query, fields).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.insert = (record) => {
  return new bluebird((resolve, reject) => {
    const document = new logs(record);
    document.save((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.edgeappGetOne = (query = {}, fields = {}) => {
  return new bluebird((resolve, reject) => {
    stores
      .findOne(query, fields)
      .populate("brandId")
      .exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
  });
};

module.exports.insert_speedtest = (record) => {
  return new bluebird((resolve, reject) => {
    const document = new commonlogs(record);
    document.save((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};

module.exports.list_speedtest = (query = {}, fields = {}) => {
  return new bluebird((resolve, reject) => {
    commonlogs.find(query, fields).exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
};