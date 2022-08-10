/**
 * @name api:shops:models:unboxing
 * @description ShopUnboxing
 */

// NPM Modules
const mongoose = require('mongoose');

// collection
const collection = new mongoose.Schema({
    shop: {
        type: mongoose.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'ShopUnboxing'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    video: {
        type: String,
        trim: true
    },
    key: {
        type: String,
        trim: true
    },
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
    strict: true,
    versionKey: false
});

module.exports = mongoose.model('Unboxing', collection);
