/**
 * @name api:shops:controllers:productsdiscount
 * @description Discount Controller
 * @author praveenraj
 * @date 02-08-2022
 */

const discountService = require("../services/discount");

module.exports.createDiscount = async (req, res) => {
  try {
    let input = req.body;
    let insertData = {};
    insertData.brandId = req.user.brandId._id;
    insertData.discCode = input.code;
    insertData.discPercentage = input.Perc;
    insertData.discMinCart = input.MinCart;
    insertData.discMaxDisc = input.MaxDisc;
    insertData.description = input.description;
    let record = await discountService.create(insertData);
    res.sendSuccess(record);
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.checkDiscount = async (req, res, next) => {
  try {
    let isExists = await discountService.findOne({
      discCode: req.body.code,
      brandId: req.user.brandId._id,
    });
    if (isExists) {
      res.sendBadRequest({ error: "Discount code already exists" });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.list = async (req, res) => {
  try {
    let input = {};
    input.query = { active: true, brandId: req.user.brandId._id };
    input.limit = req.body.limit || 10;
    input.skip = req.body.limit * req.body.offset || 0;

    let [count, discount] = await Promise.all([
      discountService.count({ active: true, brandId: req.user.brandId._id }),
      discountService.find(input.query, input.limit, input.skip),
    ]);
    res.sendSuccess({ count, discount });
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
      brandId: req.user.brandId._id
    };

    let insertData = {};
    insertData.brandId = req.user.brandId._id;
    insertData.discCode = input.code;
    insertData.discPercentage = input.Perc;
    insertData.discMinCart = input.MinCart;
    insertData.discMaxDisc = input.MaxDisc;
    insertData.description = input.description;
    let discount = await discountService.findOne(query);
    if (!discount) {
      res.sendBadRequest("Discount doesnot exists. Provide valid input.");
      return;
    }
    input.updatedAt = new Date();
    let resultData = await discountService.update(query, insertData);
    res.sendSuccess("Success! Discount updated successfully.");
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.find = async (req, res) => {
  try {
    let result = await discountService.findOne({
      _id: req.params.id,
      brandId: req.user.brandId._id,
    });
    if (!result) {
      res.sendBadRequest("Discount doesnot exists.");
      return;
    }
    res.sendSuccess(result);
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.delete = async (req, res) => {
  try {
    let query = {
      _id: req.params.id,
    };
    let resultData = await discountService.deleteOne({
      _id: query,
    });
    res.sendSuccess("Success! Discount deleted successfully.");
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};
