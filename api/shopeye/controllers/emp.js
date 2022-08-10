/**
 * @name api:shops:controllers:productsdiscount
 * @description Discount Controller
 * @author praveenraj
 * @date 02-08-2022
 */

const empService = require("../services/shop-users");

module.exports.listall = async (req, res) => {
  try {
    let input = {};
    input.query = { brandId: req.user.brandId._id };
    input.limit = req.body.limit || 10;
    input.skip = req.body.limit * req.body.offset || 0;
    let [count, emp] = await Promise.all([
      empService.count({ brandId: req.user.brandId._id }),
      empService.find(input.query, input.limit, input.skip),
    ]);
    res.sendSuccess({ count, emp });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.createEmp = async (req, res) => {
  try {
    let input = req.body;
    let insertData = {};
    insertData.brandId = req.user.brandId._id;
    insertData.mobile = input.empNumber;
    insertData.email = input.empEmail;
    insertData.companyName = input.empName;
    let record = await empService.create(insertData);
    res.sendSuccess(record);
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.checkEmp = async (req, res, next) => {
  try {
    let isExists = await empService.findOne({
      mobile: req.body.empNumber,
      brandId: req.user.brandId._id,
    });
    if (isExists) {
      res.sendBadRequest({ error: "Employee number already exists" });
    } else {
      next();
    }
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
    insertData.mobile = input.empNumber;
    insertData.email = input.empEmail;
    insertData.companyName = input.empName;
    insertData.active = input.active;
    let discount = await empService.findOne(query);
    if (!discount) {
      res.sendBadRequest("Discount doesnot exists. Provide valid input.");
      return;
    }

    input.updatedAt = new Date();
    let resultData = await empService.updateOne(query, insertData);
    res.sendSuccess("Success! Employee updated successfully.");
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.find = async (req, res) => {
  try {
    let result = await empService.findOne({
      _id: req.params.id,
      brandId: req.user.brandId._id,
    });
    if (!result) {
      res.sendBadRequest("Employee doesnot exists.");
      return;
    }
    res.sendSuccess(result);
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.checkEmpNo = async (req, res, next) => {
  try {
    const input = req.body;
    let resDupNoData = [];
    let duplicateNo = [];
    for (var i = 0; i < input.length; i++) {
      let noCheck = await empService.findOne({
        mobile: input[i].empWhatsappNumber,
        brandId: req.user.brandId._id,
      });
      if (noCheck) {
        duplicateNo.push(noCheck);
      }
    }

    if (duplicateNo) {
      for (var i = 0; i < duplicateNo.length; i++) {
        resDupNoData.push(duplicateNo[i].mobile);
      }
      req.body.duplicateNo = resDupNoData;
    }

    next();
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.checkEmpEmail = async (req, res, next) => {
  try {
    const input = req.body;
    let duplicateEmail = [];
    let resDupEmailData = [];
    for (var i = 0; i < input.length; i++) {
      let emailCheck = await empService.findOne({
        email: input[i].empEmail,
        brandId: req.user.brandId._id,
      });
      if (emailCheck) {
        duplicateEmail.push(emailCheck);
      }
    }
    if (duplicateEmail) {
      for (var i = 0; i < duplicateEmail.length; i++) {
        resDupEmailData.push(duplicateEmail[i].email);
      }
      req.body.duplicateEmail = resDupEmailData;
    }

    if (req.body.duplicateEmail.length > 0 || req.body.duplicateNo.length > 0) {
      return res.sendBadRequest({
        email: req.body.duplicateEmail,
        mobile: req.body.duplicateNo,
        message: "Duplicate Values",
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.bulkEmp = async (req, res) => {
  try {
    let input = req.body;
    const arr = input.map((data) => ({
      email: data.empEmail,
      mobile: data.empWhatsappNumber,
      companyName: data.empName,
      brandId: req.user.brandId._id,
    }));
    let resultData = await empService.insertMany(arr);
    res.sendSuccess("Upload Successfully");
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};
