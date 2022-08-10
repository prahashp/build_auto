/**
 * @name api_tickets_controllers
 * @description Tickets Controller
 */

// services
const ticketsServices = require("../services/tickets");
const ticketsModel = require("../models/tickets");
const ticketDetailsServices = require("../services/ticketdetails");
const ticketDetailsModel = require("../models/ticketdetails");
const email = require("../../core/modules/email");
const _ = require("lodash");
const bluebird = require("bluebird");
const mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId;

module.exports.list = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    input.record = {};
    input.limit = req.query.limit || 10;
    input.skip = req.query.limit * req.query.offset || 0;
    let [data, count] = await Promise.all([
        ticketsServices.findLimit(
          input.query,
          input.record,
          input.skip,
          input.limit
        ),
        ticketsServices.getCount(input.query)
      ]);
      res.status(200).json({ count: count, data: data });    
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.create = async(req, res) => {
  try{
    const input = req.body;
    let insertData = new ticketsModel(input);

    if(req.user.role == "storesuperadmin" || req.user.role == "storeadmin" || req.user.role == "storeuser" ){
      insertData.from = input.from || '';
      insertData.brandId = input.brandId || '';
    }else{
      insertData.from = req.user._id || '';
      insertData.brandId = req.user.brandId || '';
    }
    
    // console.log("insertData =>", insertData);
    let ticketInsertedData = await ticketsServices.insert(insertData);

    let ticketDetail = {};
    ticketDetail.ticketId = ticketInsertedData._id;
    ticketDetail.message = input.ticketName+", "+input.description;
    ticketDetail.attachment = input.attachment || "";
    if(req.user.role == "storesuperadmin" || req.user.role == "storeadmin" || req.user.role == "storeuser" ){
      ticketDetail.brandId = input.brandId || '';
      ticketDetail.fromId = '';
      ticketDetail.toId = input.from;
    }else{
      ticketDetail.brandId = req.user.brandId || req.body.brandId;
      ticketDetail.fromId = req.user._id;
      ticketDetail.toId = "";
    }
    
    let insertDetailsData = new ticketDetailsModel(ticketDetail);
    let ticketDetailsInsertedData = await ticketDetailsServices.insert(insertDetailsData);

    if(req.user){
      email.sendTicketCreated({
        ticketId: ticketInsertedData._id,
        email: req.user.email,
      })
    }    

    if(ticketInsertedData){
      return res.sendSuccess("Ticket Created Successfully");
    }else{
      return res.sendServerError("something went wrong please try again");
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  };
};

module.exports.getOne = async (req, res) => {
  try {
    let input = {};
    input._id = req.params.id;
    let ticket = await ticketsServices.get(input);
    // console.log("ticket =>", ticket);
    if (ticket.length) {
      res.sendSuccess(ticket);
    } else {
      res.sendBadRequest("Ticket doesnot exists. Provide valid input.");
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.update = async (req, res) => {
  try {
    const input = req.body;
    let query = {
      _id: req.params.id,
    };

    let ticket = await ticketsServices.get(query);
    if (ticket.length) {
      input.updatedAt = new Date();
      let userUpdateData = await ticketsServices.updateOne(query, input);
      // console.log("userUpdateData =>", userUpdateData);
      if(userUpdateData.acknowledged){
        res.sendSuccess("Success! Ticket Updated Successfully.");
      }else{
        res.sendServerError("something went wrong please try again");
      }
    }else{      
      res.sendBadRequest("Ticket doesnot exists. Provide valid input.");
      return;
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.getTicketDetails = async (req, res) => {
  try {
    let input = {};
    input.ticketId = ObjectId(req.params.id);
    // console.log("input =>", input);
    let ticket = await ticketsServices.getOne({_id:input.ticketId});

    let ticketDetails = await ticketDetailsServices.get(input);
    // console.log("ticket =>", ticket);
    let data = {ticket,ticketDetails};

    if (ticket) {
      res.sendSuccess(data);
    } else {
      res.sendBadRequest("Ticket doesnot exists. Provide valid input.");
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.addTicketDetails = async (req, res) => {
  try {
    const input = req.body;
    let query = {
      _id: req.params.id,
    };

    let ticket = await ticketsServices.get(query);
    if (ticket.length) {
      if(req.user.role == "storesuperadmin" || req.user.role == "storeadmin" || req.user.role == "storeuser"){
        input.ticketId = ObjectId(req.params.id);
        input.fromId = req.user._id;
        input.brandId = req.user.brandId || input.brandId;
        let insertData = await ticketDetailsServices.insert(input);
        if(insertData){
          res.sendSuccess("Success! Ticket Log Updated.");
        }else{
          res.sendServerError("something went wrong please try again");
        }
      }else if(req.user.role == "superadmin" || req.user.role == "admin" || req.user.role == "user"){
        input.ticketId = ObjectId(req.params.id);
        input.toId = req.user._id;
        input.brandId = req.user.brandId || input.brandId;
        let insertData = await ticketDetailsServices.insert(input);
        if(insertData){
          res.sendSuccess("Success! Ticket Log Updated.");
        }else{
          res.sendServerError("something went wrong please try again");
        }
      }      
    }else{      
      res.sendBadRequest("Ticket doesnot exists. Provide valid input.");
      return;
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.ticketStatusChange = async (req, res) => {
  try {
    const input = req.body;
    let query = {
      _id: req.params.id,
    };

    let ticket = await ticketsServices.get(query);
    if (ticket.length) {
      let updatedData = {};
      updatedData.updatedAt = new Date();
      updatedData.status = input.status;
      
      // console.log("query =>", query);
      // console.log("updatedData =>", updatedData);
      let userUpdateData = await ticketsServices.updateOne(query, updatedData);
      // console.log("userUpdateData =>", userUpdateData);
      if(userUpdateData.acknowledged){
        res.sendSuccess("Success! Ticket Updated Successfully.");
      }else{
        res.sendServerError("something went wrong please try again");
      }
    }else{      
      res.sendBadRequest("Ticket doesnot exists. Provide valid input.");
      return;
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.ticketAssign = async (req, res) => {
  try {
    const input = req.body;
    let query = {
      _id: req.params.id,
    };

    let ticket = await ticketsServices.get(query);
    if (ticket.length) {
      let updatedData = {};
      updatedData.updatedAt = new Date();
      updatedData.assignTo = input.assignTo;
      updatedData.status = "inprogress";
      // console.log("updatedData =>", updatedData);
      let userUpdateData = await ticketsServices.updateOne(query, updatedData);
      if(userUpdateData.acknowledged){
        res.sendSuccess("Success! Ticket Updated Successfully.");
      }else{
        res.sendServerError("something went wrong please try again");
      }
    }else{      
      res.sendBadRequest("Ticket doesnot exists. Provide valid input.");
      return;
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};