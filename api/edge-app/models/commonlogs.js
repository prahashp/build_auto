/**
 * @name api_edgeapp_commonlog_models
 * @description Edgeapp Common logs Schema
 */

// NPM Modules
const mongoose = require("mongoose");

// Schema
const collection = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    speedTest: [
      {
        download: {
          type: String,
          trim: true,
        },
        upload: {
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
    logType: {
      type: String,
      trim: true,
    },
  },
  {
    versionKey: false,
    strict: true,
  }
);

module.exports = mongoose.model("CommonLog", collection);
