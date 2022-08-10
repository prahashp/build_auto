/**
 * @name api_auth_models_user
 * @description User Model
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

// Model
const collection = new mongoose.Schema({
    clientIndex: {
        type: Number
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },    
    client_id: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    dialCode: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['storesuperadmin', 'storeadmin', 'storeuser', 'shopeyeadmin', 'shopeyeuser','superadmin','admin', 'user'],
        default: 'storesuperadmin'
    },
    storeType: {
        type: String,
        enum: ['group', 'single'],
    },
    stores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    }],
    email_verify:{
        type: Boolean,
        default: true
    },
    phone_verify:{
        type: Boolean,
        default: false
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],
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
    },
    twoFactorAuthenticationCode: {
		type: String,
	},
    isTwoFactorAuthenticationEnabled: {
		type: Boolean,
	},
	qrcode: {
		type: String,
	},
    refreshToken:{
        type: String
    }
}, {
    strict: true,
    versionKey: false
});

// Plugins
collection.plugin(uniqueValidator);

module.exports = mongoose.model('User', collection);
