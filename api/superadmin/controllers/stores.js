/**
 * @name api_stores_controllers_store
 * @description Store Controller
 */

// services
const storeService = require('.././services/stores'),

// modules
    stores = require('.././modules/stores');
const userService = require('../services/adminUsers')
const brnadService= require("../services/brand")

module.exports.new = (req, res) => {
    const input = req.body;
    input.admin = req.user._id;
    storeService.getCount({
      brandId: req.body.brandId
    })
        .then(async storesCount => {
          let query = {
            _id: req.body.brandId,
          };
          let brandDetails = await brnadService.getOne(query);
            const storeId = storesCount < 1000 ? `000${storesCount + 1}`.slice(-3) : storesCount + 1;
            const userId = brandDetails.brandIndex < 100 ? `0${brandDetails.brandIndex}`.slice(-2) : brandDetails.brandIndex;
            input.id = `${userId}-${storeId}`;
            input.appId = stores.generateAppId();
            input.brandId = req.body.brandId
            return storeService.insert(input);
        })
        .then(record => {
            res.sendSuccess(record);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.list = async (req, res) => {
  try {
    let query = {};
    let stores = await storeService.getMany(query);
    res.sendSuccess(stores);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};


module.exports.find = async (req, res) => {
  try {
    const _id = req.params.id;

    let user = await storeService.getOne({ _id });
    if (!user) {
      res.sendBadRequest("Stores doesnot exists.");
      return;
    }

    res.sendSuccess(user);
  } catch (error) {
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
    let store = await storeService.getOne(query);
    if (!store) {
      res.sendBadRequest("Store doesnot exists. Provide valid input.");
      return;
    }

    await storeService.updateOne(query, input);
    res.sendSuccess("Success! Store updated successfully.");
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.delete = async (req, res) => {
  try {
    let query = {
      _id: req.params.id,
    };

    let user = await storeService.getOne(query);
    if (!user) {
      res.sendBadRequest("Store doesnot exists. Provide valid input.");
      return;
    }

    await storeService.updateOne(query, { active: false });
    res.sendSuccess("Success! Store deleted successfully.");
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};