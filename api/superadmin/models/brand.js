/**
 * @name api_auth_models_user
 * @description User Model
 */

// NPM Modules
const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

// Model
const collection = new mongoose.Schema(
  {
    brandName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    brandIndex: {
      type: Number,
      required: true,
      unique: true,
    },
    client_id: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dialCode: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    storesuperadmin: [],
    storeadmin: [],
    storeuser: [],
    registeredCompanyName: {
      type: String,
      trim: true,
    },
    brandLogo: {
      type: String,
      trim: true,
    },
    brandConfigs: {      
      storeOpenTime: {
        type: String,
      },
      storeCloseTime: {
        type: String,
      },
      infraAlert: {
        condition: {
          type: String,
        },
        value: {
          type: String,
        },
      },
      bouncedConfigTime: {
        type: String,
      },
      missedOpportunityStartTime: {
        type: String,
      },
      missedOpportunityEndTime: {
        type: String,
      },
      conversionConfigTime: {
        type: String,
      },
      missedOpportunityCalculate: {
        type: String,
        enum: ["engagers-conversion", "group-conversion"],
      },
      conversionCalculate: {
        type: String,
        enum: ["footfall-count", "engagers-count"],
      },
      billableCalculate: {
        type: String,
        enum: ["footfall-count", "engagers-count"],
      },
      notifications: {
        email: {
          type: Boolean,
        },
        application: {
          type: Boolean,
        },
      },
    },
    industry: {
      type: String,
      trim: true,
    },
    subIndustry: {
      type: String,
      trim: true,
    },
    storeType: {
      type: String,
      trim: true,
    },
    headQuarters: {
      type: String,
      trim: true,
    },
    numberofOutlets: {
      type: String,
      trim: true,
    },
    cameraCount: {
      type: String,
      trim: true,
    },
    productsavgPrice: {
      type: String,
      trim: true,
    },
    CINNumber: {
      type: String,
      trim: true,
    },
    registeredAddress: {
      type: String,
      trim: true,
    },
    store_info_count: {
      type: String,
      default: 0
    },
    store_sqft: {
      type: String,
      default: 0
    },
    first_user: {
      type: Number,
      default: 0
    },
    subscription: {
      type: String
    },
    uploadLimit: {
      user: {
        type: Number,
        default: 0
      },
      store: {
        type: Number,
        default: 0
      },
    },
    DownloadLimit: {
      type: Number,
      default: 0
    },
  },
  {
    strict: true,
    versionKey: false,
  }
);

// Plugins
collection.plugin(uniqueValidator);

module.exports = mongoose.model("Brand", collection);
