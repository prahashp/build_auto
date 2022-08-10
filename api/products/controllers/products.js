/**
 * @name api_products_controllers
 * @description Products Controller
 */

// services
const productsServices = require("../services/products");
const productsModel = require("../models/products");
const _ = require("lodash");
const bluebird = require("bluebird");
const mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId;

module.exports.list = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    input.record = {};
    let [data, count] = await Promise.all([
        productsServices.find(
          input.query,
          input.record
        ),
        productsServices.getCount(input.query)
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
    let insertData = new productsModel(input);
    let productInsertedData = await productsServices.insert(insertData);    
    // console.log("productInsertedData =>", productInsertedData);
    if(productInsertedData){
      return res.sendSuccess("Product Created Successfully");
    }else{
      return res.sendServerError("something went wrong please try again");
    }
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  };
};