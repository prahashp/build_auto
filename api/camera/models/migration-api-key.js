// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

const collection = new mongoose.Schema({
    apiKey: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    strict: true,
    versionKey: false
});

collection.plugin(uniqueValidator);

module.exports = mongoose.model('MigrationApiKey', collection);
