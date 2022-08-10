/**
 * @name api_edgeapp_models
 * @description Edgeapp Schema
 */

// NPM Modules
const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

// Schema
const collection = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    app_version: {
      type: String,
      trim: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    strict: true,
  }
);
collection.plugin(uniqueValidator);

module.exports = mongoose.model('Edgeapp', collection);
