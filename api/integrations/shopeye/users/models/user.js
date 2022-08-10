/**
 * @name api_auth_models_user
 * @description User Model
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

// Model
const collection = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    companyName: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    otp: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    strict: true,
    versionKey: false
});

module.exports = mongoose.model('ShopUser', collection);
