/**
 * @name api_camera_models_camera
 * @description Camera Schema
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

// Schema
const collection = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    storeId: {
        type: String,
        trim: true
    },
    client_id: {
        type: String,
        trim: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    tagging: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tagging'
    }],
    ip: {
        type: String,
        trim: true
    },
    manufacture: {
        type: String,
        trim: true
    },
    no: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    subType: {
        type: String,
        trim: true
    },
    RTSP: {
        type: String,
        trim: true
    },
    retentionPeriod: {
        type: Number
    },
    streamName: {
        type: String,
        trim: true
    },
    thumbnailImage: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    isActivated: {
        type: Boolean
    },
    isUp: {
        type: Boolean
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

module.exports = mongoose.model('Camera', collection);
