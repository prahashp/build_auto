/**
 * @name api_subscription_models
 * @description Subscription Schema
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

// Schema
const collection = new mongoose.Schema({
   subscriptionName: {
        type: String,
        trim: true
    },
    storeCount:{
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    strict: true,
    versionKey: false
});

collection.plugin(uniqueValidator);

module.exports = mongoose.model('Subscription', collection);
