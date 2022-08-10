/**
 * @name api_subscription_controllers
 * @description Subscription Controller
 */

// services
const subscriptionServices = require("../services/subscription");
const subscriptionModel = require("../models/subscription");
const _ = require("lodash");
// NPM Modules
bluebird = require("bluebird");

module.exports.list = async (req, res) => {
  try {
    let input = {};
    input.query = {};

    if (req.user._id) {
      input.query._id = { $ne: req.user._id };
    }

    input.record = {};
    input.limit = req.query.limit || 10;
    input.skip = req.query.limit * req.query.offset || 0;

    let [data, count, imgData] = await Promise.all([
        subscriptionServices.findLimit(
          input.query,
          input.skip,
          input.limit
        ),
        subscriptionServices.getCount(input.query)
      ]);
      res.status(200).json({ data: data, count: count});    
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.getOne = async (req, res) => {
  try {
    let input = {};
    input._id = req.params.id;
    let subscription = await subscriptionServices.find(input);
    if (subscription) {
      res.sendSuccess(subscription);
    } else {
      res.sendServerError("no subscription");
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.create = async(req, res) => {
  try{
    const input = req.body;
    let checkName = subscriptionServices.get({subscriptionName:input.name});
    // console.log("checkName =>", checkName);
    if(!checkName){
      let insertData = new subscriptionModel(input);
      console.log("insertData =>", insertData);
      let resultData = await subscriptionServices.insert(insertData);
      if(resultData){
        return res.sendSuccess("Subscription Created Successfully")
      }else{
        return res.sendServerError("something went wrong please try agian later");
      }
    }else{
      return res.sendBadRequest("Name Already Exist");
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  };
};

module.exports.update = async (req, res) => {
  try {
    const input = req.body;   
    let query = {
      _id: req.params.id,
    };

    let subscription = await subscriptionServices.get(query);
    if (!subscription) {
      res.sendBadRequest("Subscription doesnot exists. Provide valid input.");
      return;
    }
    input.updatedAt = new Date();
    let inputData = new subscriptionModel(input);
    let userUpdateData = await subscriptionServices.updateOne(query, inputData);
    if(userUpdateData){
      res.sendSuccess("Success! Account Updated Successfully.");
    }else{
      res.sendServerError("something went wrong please try again");
    }
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};