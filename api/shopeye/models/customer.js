/**
 * @name api:shops:models:customer
 * @description Customer
 */

// NPM Modules
const mongoose = require("mongoose");

// collection
const collection = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Types.ObjectId,
      required: true,
      trim: true,
      ref: "Brand",
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    customerName: {
      type: String,
      trim: true,
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
    strict: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Customer", collection);
