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
   ticketName: {
        type: String,
        trim: true,
        required: true,
    },
    issueType:{
        type: String,
        trim: true,
    },
    priority:{
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'low'
    },
    description:{
        type: String,
        trim: true,
    },
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status:{
        type: String,
        enum: ['open', 'inprogress', 'closed'],
        default: 'open'
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

module.exports = mongoose.model('Ticket', collection);
