/**
 * @name api_edgeapp_log_models
 * @description Edgeapp logs Schema
 */

// NPM Modules
const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  // configuration
  config = require("../../.././config").auth;
// Schema
const collection = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      expires: config.tokenExpires,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    ips: [
      {
        ip: {
          type: String,
          trim: true,
        },
        manufacturer: {
          type: String,
          trim: true,
        },
        macId: {
          type: String,
          trim: true,
        },
      },
    ],
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
  },
  {
    versionKey: false,
    strict: true,
  }
);

module.exports = mongoose.model("IpLog", collection);
