/**
 * @name api_stores_models_store
 * @description Store Schema
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

// Schema
const collection = new mongoose.Schema({
    gmt_offset: {
        type: String
    },
    timezone_value: {
        type: String
    }
}, {
    versionKey: false,
    strict: true
});

collection.plugin(uniqueValidator);

module.exports = mongoose.model('Timezone', collection);
