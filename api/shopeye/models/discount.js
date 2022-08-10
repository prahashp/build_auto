/**
 * @name api:shops:models:share
 * @description Discount
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
    discCode: {
      type: String,
      required: true,
      trim: true,
    },
    discPercentage: {
      type: Number,
      default: 0,
      trim: true,
    },
    discMinCart: {
      type: Number,
      trim: true,
      default: 0,
    },
    discMaxDisc: {
      type: Number,
      trim: true,
      default: 0,
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
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    strict: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Discount", collection);
