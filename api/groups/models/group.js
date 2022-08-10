/**
 * @name api_stores_models_store
 * @description Store Schema
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

// Schema
const collection = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    groupName: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    tag: {
        type: String,
        trim: true
    },
    otherName: {
        type: String,
        trim: true
    },
    stores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    active: {
        type: Boolean,
        default: true
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
    versionKey: false,
    strict: true
});

collection.plugin(uniqueValidator);

module.exports = mongoose.model('Group', collection);
