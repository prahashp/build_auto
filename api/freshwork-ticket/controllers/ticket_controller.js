/**
 * @name api_ticket_controller
 * @description Ticket Controller
 * @author praveenraj
 */
const { createTicket, getTicket, createReply, updateTicket } = require("../../../config/freshdesk/freshdesk");
const formidable = require("formidable");
const fs = require("fs");
const fdTicket=require("../.././freshwork-ticket/services/ticket");
const bluebird = require("bluebird"),
_ = require('lodash');
const alertsServices = require('../../alerts/services/alerts');
const userService = require('../../users/services/users');

module.exports.create_ticket_c = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    var json_data = {};
    var formfields = await new Promise((resolve, reject) => {
      form.options.keepExtensions = true;
      form.keepExtensions = true;
      form.parse(req, function (err, fields, files) {
        if (err) {
          reject(err);
          return;
        }
        json_data.name = fields.name;
        json_data.email = fields.email;
        json_data.subject = fields.subject;
        json_data.description = fields.description || "";
        json_data.status = parseInt(fields.status);
        json_data.priority = parseInt(fields.priority);
        if (files.image) {
          var oldPath = files.image.filepath;
          json_data.attachments = [fs.createReadStream(oldPath)];
        }
        resolve(json_data);
      });
    });
    // formfields.status = "open";
    let getuser = await userService.findOne({email:json_data.email});    
    let data = await createTicket(formfields);
    let saving_data = {
      name: json_data.name,
      email: json_data.email,
      subject: json_data.subject,
      description: json_data.description,
      status: json_data.status,
      priority: json_data.priority,
      ticketNo: data.ticket_id,
      brandId: req.user.brandId || getuser.brandId || "",
    };
    await fdTicket.insert(saving_data);

    let alertInsertData = {
      name : 'Support Queries',
      description: data.ticket_id+' has been created',
      category: 'Form',
      clientNotification: true,
      adminNotification: true,
      brandId: req.user.brandId || getuser.brandId || "",
      user: req.user._id
    };
    alertsServices.insert(alertInsertData)

    res.sendSuccess({
      data: "Ticket created successfully",
    });
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

module.exports.list_old= async (req, res) => {
  try{

      let query = {};
  
      let tickets = await fdTicket.getMany(query);
      res.sendSuccess(tickets)
  }catch(error){
      if (error.name === 'ValidationError')
          res.sendBadRequest(error);
      else
          res.sendServerError(error);
  }
};

module.exports.list = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    if(req.user.role && req.user.role =='storesuperadmin' || req.user.role =='storeadmin' || req.user.role =='storeuser'){
      if (req.user.brandId) {
        input.query.brandId = req.user.brandId;
      }
  
      if (req.query.brandId) {
        input.query.brandId = req.query.brandId;
      }
    }else{
      if (req.query.brandId) {
        input.query.brandId = req.query.brandId;
      }
    }

    input.limit = req.query.limit || 10;
    input.skip = req.query.limit * req.query.offset || 0;
    input.record = {};

    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        // console.log("params =>", params);
        return bluebird.all([
          fdTicket.findLimit(
            params.query,
            params.record,
            params.skip,
            params.limit
          ),
          fdTicket.getCount(params.query),
        ]);
      })
      .spread((data, count) => {
        res.status(200).json({ count, data });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.find = async (req, res) => {
  try{
      const _id = req.body.id;
      let ticket = await fdTicket.getOne({_id});
      if (!ticket) {
          res.sendBadRequest('ticket doesnot exists. Provide valid input.');
          return;
      }
      res.sendSuccess(ticket)
  }catch(error){
      if (error.name === 'ValidationError')
          res.sendBadRequest(error);
      else
          res.sendServerError(error);
  }
};

module.exports.listAllConversations = async (req, res) => {
  try{
  
    const _id = req.body.id;
    let ticketNo = await getTicket(_id)
    res.sendSuccess(ticketNo)
}catch(error){
    if (error.name === 'ValidationError')
        res.sendBadRequest(error);
    else
        res.sendServerError(error);
}

}

module.exports.createReply = async(req, res) =>{
  try{
    let ticketNo = await createReply(req.body)
    res.sendSuccess(ticketNo)
  }catch(error){
    if (error.status === 404){
    res.sendBadRequest(error);
    }
else{
    res.sendServerError(error);
}
  }
}

module.exports.update = async (req, res) => {
  try{
    const input = req.body;
    let query = {
      _id: req.params.id
    };

    let ticket = await fdTicket.getOne(query);
    if (!ticket) {
      res.sendBadRequest('ticket doesnot exists. Provide valid input.');
      return;
    }
    if (req.body.assignto && req.body.assignto !== '') {
      let data = {};
      data.ticketNo = ticket.ticketNo;
      data.status = 3;
      let ticketStatus = await updateTicket(data);
      if (ticketStatus) {
        input.status = 3;
      }
    }
    let updateStatus = await fdTicket.updateOne(query, input)
    if (updateStatus) {
      res.sendSuccess('Success! Ticket updated successfully.')
    } else {
      res.sendBadRequest("Something went wrong, please try again");
    }
  } catch (error) {
    if (error.name === 'ValidationError')
      res.sendBadRequest(error);
    else
      res.sendServerError(error);
  }
};

module.exports.delete = async (req, res) => {
  try{
      let query = {
          _id: req.params.id
      };  
      let ticket = await fdTicket.getOne(query);
      if (!ticket) {
          res.sendBadRequest('ticket doesnot exists. Provide valid input.');
          return;
      }  
      await fdTicket.updateOne(query, {active: false})
      res.sendSuccess('Success! Ticket deleted successfully.')
  }catch(error){
      if (error.name === 'ValidationError')
          res.sendBadRequest(error);
      else
          res.sendServerError(error);
  }
};

module.exports.statusUpdate = async (req, res) => {
  try {
    let query = {
      _id: req.body.id
    };
    const input ={'status':req.body.status}
    let ticket = await fdTicket.getOne(query);
    if (!ticket) {
      res.sendBadRequest('Ticket does not exists. Provide Valid Input.');
      return;
    }
    var data = {}
    data.ticketNo = ticket.ticketNo
    data.status = req.body.status
    let ticketStatus = await updateTicket(data)
    if(ticketStatus){
      let updateStatus = await fdTicket.updateOne(query, input)
      if(updateStatus){
        res.sendSuccess("Ticket Status Updated Successfully")
      }
      else{
        res.sendBadRequest("Something went Wrong, Please try again");
      }
    }
  } catch (error) {
    if (error.name === 'ValidationError')
      res.sendBadRequest(error);
    else
      res.sendServerError(error);
  }
};