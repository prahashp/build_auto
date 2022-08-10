/**
 * @name api_stores_models_store
 * @description Store Schema
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

// Schema
const collection = new mongoose.Schema({
    name: {
        type: String
    },
    dial_code: {
        type: String
    },
    code: {
        type: String
    }
}, {
    versionKey: false,
    strict: true
});

collection.plugin(uniqueValidator);

module.exports = mongoose.model('Countrycode', collection);
