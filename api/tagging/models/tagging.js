/**
 * @name api_camera_models_camera
 * @description Camera Schema
 */

// NPM Modules
const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

// Schema
const collection = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    camera: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camera",
      required: true,
    },
    tagName: {
      type: String,
      trim: true,
    },
    coordinates: [],
    tagBaseImage: {
      type: String,
      trim: true,
    },
    tagImage: {
      type: String,
      trim: true,
    },
    imageBaseUrl: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    streamName: {
      type: String,
      trim: true,
    },
  },
  {
    strict: true,
    versionKey: false,
  }
);

collection.plugin(uniqueValidator);

module.exports = mongoose.model("Tagging", collection);
