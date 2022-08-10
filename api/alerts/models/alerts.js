/**
 * @name api_alerts_models_alerts
 * @description Alerts Schema
 */

// NPM Modules
const mongoose = require('mongoose');

// collection
const collection = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    brandId: {
        type: String,
        trim: true,
        required: true
    },
    storeId: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    clientNotification:{
        type: Boolean,
        trim: true
    },
    adminNotification:{
        type: Boolean,
        trim: true
    }
}, {
    versionKey: false,
    strict: true
});

module.exports = mongoose.model('Alert', collection);
