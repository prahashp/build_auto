/**
 * @name api:shops:models:users
 * @description ShopUsers
 */

// NPM Modules
const mongoose = require("mongoose");

// collection
const collection = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    brandId: {
      type: mongoose.Types.ObjectId,
      required: true,
      trim: true,
      ref: "Brand",
    },
    email: {
      type: String,
      trim: true,
    },
  },
  {
    strict: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("ShopUser", collection);
