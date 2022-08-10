/**
 * @name api:shops:models:racks
 * @description ShopUsers
 */

// NPM Modules
const mongoose = require('mongoose');

const Product = {
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
        type: String,
        default: "",
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
    customMedia: [],
    showOnlyCustomMedia: {
        type: Boolean,
        default: 0
    },
};

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
        trim: true,
        default: ""
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    category: {
        type: String,
        trim: true,
        default: null
    },
    source: {
        coverImage: {
            type: String,
            required: true,
            trim: true
        },
        key: {
            type: String,
            required: true,
            trim: true
        },
    },
    products: [Product],
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

module.exports = mongoose.model('Shelf', collection);
