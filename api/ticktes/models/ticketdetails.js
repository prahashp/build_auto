/**
 * @name api_tickets_models
 * @description Tickets Schema
 */

// NPM Modules
const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

// Schema
const collection = new mongoose.Schema({
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
   ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
    },
    message:{
        type: String
    },
    attachment:{
        type: String,
        trim: true,
    },
    fromId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    toId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

collection.plugin(uniqueValidator);

module.exports = mongoose.model('TicketDetail', collection);
