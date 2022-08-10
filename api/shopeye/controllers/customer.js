/**
 * @name api:shops:controllers:productsdiscount
 * @description Discount Controller
 * @author praveenraj
 * @date 02-08-2022
 */

const customerService = require("../services/customer");
const _ = require("lodash");

module.exports.createCust = async (req, res) => {
  try {
    let input = req.body;
    let insertData = {};
    insertData.brandId = req.user.brandId._id;
    insertData.mobile = input.cusNumber;
    insertData.location = input.cuslocation;
    insertData.customerName = input.cusName;
    let record = await customerService.create(insertData);
    res.sendSuccess(record);
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};
module.exports.checkCust = async (req, res, next) => {
  try {
    let isExists = await customerService.findOne({
      mobile: req.body.cusNumber,
      brandId: req.user.brandId._id,
    });
    if (isExists) {
      res.sendBadRequest({ error: "Customer number already exists" });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};
module.exports.listall = async (req, res) => {
  try {
    let input = {};
    input.query = { brandId: req.user.brandId._id };
    input.limit = req.body.limit || 10;
    input.skip = req.body.limit * req.body.offset || 0;
    let [count, emp] = await Promise.all([
      customerService.count({ brandId: req.user.brandId._id }),
      customerService.find(input.query, input.limit, input.skip),
    ]);
    res.sendSuccess({ count, emp });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.update = async (req, res) => {
  try {
    const input = req.body;
    let query = {
      _id: req.params.id,
      brandId: req.user.brandId._id,
    };

    let insertData = {};
    insertData.brandId = req.user.brandId._id;
    insertData.mobile = input.cusNumber;
    insertData.location = input.cuslocation;
    insertData.customerName = input.cusName;
    insertData.active = input.active;
    let cusValue = await customerService.findOne(query);
    if (!cusValue) {
      res.sendBadRequest("Customer doesnot exists. Provide valid input.");
      return;
    }

    input.updatedAt = new Date();
    let resultData = await customerService.updateOne(query, insertData);
    res.sendSuccess("Success! Customer updated successfully.");
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.find = async (req, res) => {
  try {
    let result = await customerService.findOne({
      _id: req.params.id,
      brandId: req.user.brandId._id,
    });
    if (!result) {
      res.sendBadRequest("Customer doesnot exists.");
      return;
    }
    res.sendSuccess(result);
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.checkcustNo = async (req, res, next) => {
  try {
    const input = req.body;
    console.log(req.user);
    let duplicateNo = [];
    let resDupData=[];
    for (var i = 0; i < input.length; i++) {
      let noCheck = await customerService.findOne({
        mobile: input[i].cusNumber,
        brandId: req.user.brandId._id,
      });
      if (noCheck) {
        duplicateNo.push(noCheck);
      }
    }
    if (duplicateNo.length > 0) {
      for(var i=0;i<duplicateNo.length;i++){
        resDupData.push(duplicateNo[i].mobile)
      }

      return res.sendBadRequest({
        mobile: resDupData,
        message: "Duplicate Values",
      });
    }
    next()
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.bulkEmp = async (req, res) => {
  try {
    let input = req.body;
    const arr = input.map((data) => ({
      customerName: data.cusName,
      mobile: data.cusNumber,
      location: data.cuslocation,
      brandId: req.user.brandId._id,
    }));
    let resultData = await customerService.insertMany(arr);
    res.sendSuccess("Upload Successfully");
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};
