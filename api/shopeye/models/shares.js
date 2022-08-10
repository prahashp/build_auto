/**
 * @name api:shops:models:share
 * @description Shares
 */

// NPM Modules
const mongoose = require('mongoose');

const collection = new mongoose.Schema({
    shopId: {
        type: mongoose.Types.ObjectId,
        ref: 'ShopUser'
    },
    messageId: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId
    },
    shelfId: {
        type: mongoose.Types.ObjectId
    },
    virtualTourId: {
        type: mongoose.Types.ObjectId
    },
    unboxingVideoId: {
        type: mongoose.Types.ObjectId
    },
    createdAt:{
        type: Date,
        default: new Date()
    }
}, {
    strict: false,
    versionKey: false
});

module.exports = mongoose.model('Share', collection);