/**
 * @name api_auth_models_storeConfig
 * @description Store Config Model
 * @author praveenraj
 */
// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

//model
const collection=new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    bouncedStart:{
        type: String
    },
    bouncedEnd:{
        type: String
    },
    conversionStart:{
        type: String
    },
    conversionEnd:{
        type: String
    },
    opportunityStart:{
        type: String
    },
    opportunityEnd:{
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{
    strict: true,
    versionKey: false
})
// Plugins
collection.plugin(uniqueValidator);

module.exports = mongoose.model('storeConfig', collection);
