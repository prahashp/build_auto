/**
 * @name api_products_models
 * @description Products Schema
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

// Schema
const collection = new mongoose.Schema({
    productName: {
        type: String,
        trim: true,
        required: true,
    },
    icon:{
        type: String,
        trim: true,
    },
    url:{
        type: String,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    active:{
        type: Boolean,
        default: true,
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

module.exports = mongoose.model('Tangoproduct', collection);
