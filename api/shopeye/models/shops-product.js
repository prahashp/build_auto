/**
 * @name api:shops:models:racks
 * @description ShopUsers
 */

// NPM Modules
const mongoose = require('mongoose');

// collection
const collection = new mongoose.Schema({
    shop: {
        type: mongoose.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'ShopUser'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    price: {
        type: Number,
        default: 0,
        trim: true
    },
    key: {
        type: String,
        required: true,
        trim: true
    },
    coverImage: {
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

module.exports = mongoose.model('Product', collection);
