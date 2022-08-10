/**
 * @name api_auth_models_token
 * @description Api Tokens
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),

    // configuration
    config = require('../../.././config').auth;

// schema
const collection = new mongoose.Schema({
    token: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    refreshToken: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    type: {
        type: String,
        enum: ['access-token', 'verify-user', 'forgot-pwd', 'reset-pwd','email-otp','phone-otp','edgeapp-access-token'],
        default: 'access-token'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: config.tokenExpires
    }
}, {
    strict: true,
    versionKey: false
});

collection.plugin(uniqueValidator);

module.exports = mongoose.model('Token', collection);