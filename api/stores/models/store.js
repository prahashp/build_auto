/**
 * @name api_stores_models_store
 * @description Store Schema
 */

// NPM Modules
const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

// Schema
const collection = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    client_id: {
        type: String,
        trim: true
    },
    id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      required: false,
    },
    latitude: {
      type: Number,
      trim: true,
      required: false,
      default: 0.0,
    },
    longitude: {
      type: Number,
      trim: true,
      required: false,
      default: 0.0,
    },
    spoc: {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      email: {
        type: String,
        trim: true,
        required: true,
      },
      contact: {
        type: String,
        trim: true,
        required: true,
      },
    },
    appId: {
      type: String,
      trim: true,
        required: true,
        unique: true,
    },
    appVersion: {
      type: String,
      trim: true,
    },
    architecture: {
      type: String,
      trim: true,
    },
    paired: {
      type: Boolean,
      default: false,
    },
    configured: {
      type: Boolean,
      default: false,
    },
    storeType:{
      type: String,
      trim: true,
    },
    hibernet: {
      enabled: {
        type: Boolean,
      },
      startTime: {
        type: String,
        trim: true,
      },
      endTime: {
        type: String,
        trim: true,
      },
    },
    autoScanIPList: {
      ipAddress: {
        type: String,
        trim: true,
      },
      macAddress: {
        type: String,
        trim: true,
      },
      manufacture: {
        type: String,
        trim: true,
      },
    },
    camera: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camera'
    }],
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    client_id:{
      type: String,
    },
    edgeAppToken: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
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

// collection.plugin(uniqueValidator);

module.exports = mongoose.model("Store", collection);
