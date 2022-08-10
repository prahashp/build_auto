/**
 * @name api:shops:models:Order
 * @description Orders
 */

// NPM Modules
const mongoose = require('mongoose');

const collection = new mongoose.Schema({
    shop: {
        type: mongoose.Types.ObjectId,
        ref: 'ShopUser'
    },
    products: [
        {
            type: mongoose.Schema.Types.Mixed
        }
    ],
    customer: {
        name: {
            type: String,
            trim: true
        },
        mobile: {
            type: String,
            trim: true
        }
    },
    purchased: {
        type: Boolean
    },
    orderType: {
        type: String,
        trim: true
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
    strict: false,
    versionKey: false
});

module.exports = mongoose.model('Order', collection);