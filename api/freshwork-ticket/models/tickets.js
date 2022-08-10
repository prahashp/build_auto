/**
 * @name api_ticket_models_tickets
 * @description ticket Model
 * @author praveenraj
 */

const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

    const collection=new mongoose.Schema({
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand'
        },
        assignto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: {
            type: String
        },
        name:{
            type: String,
            trim: true,
            // required: true,  
        },
        email:{
            type: String,
            trim: true,
            required: true,     
        },
        subject:{
            type: String, 
        },
        description:{
            type: String,
        },
        status:{
            type: String
        },
        priority:{
            type: String 
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        ticketNo:{
            type: Number,
            required: true, 
        }

    },{
        strict: true,
        versionKey: false
    })
    // Plugins
collection.plugin(uniqueValidator);

module.exports = mongoose.model('fdtickets', collection);
