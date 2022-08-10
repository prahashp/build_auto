/**
 * @name api_groups_controllers_store
 * @description Store Controller
 */

// services
const groupService = require('../services/groups'),
  userService = require("../../users/services/users"),

  // modules
  groups = require('../modules/groups');
const brnadService = require('../../superadmin/services/brand');
const email = require("../../core/modules/email/index");
const bluebird = require('bluebird');
const alertsServices = require('../../alerts/services/alerts');
const { default: mongoose } = require('mongoose');

module.exports.new = async (req, res) => {
  try {
    const input = req.body;
    input.admin = req.user._id;
    input.brandId = req.user.brandId;
    let insert = await groupService.insert(input)
    req.body.users.forEach(async (element) => {
      let userupdate = await userService.updateOne({ _id: new mongoose.Types.ObjectId(element) }, { storeType: "group", groups: [insert._id] })
    })
    res.sendSuccess(insert);
  } catch (error) {
    res.sendServerError(error);

  }
};

module.exports.list = async (req, res) => {
  try {
    let input = {};
    input.query = {};

    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }

    if (req.query.groupId) {
      input.query._id = req.query.groupId;
    }

    input.limit = req.query.limit || 10;
    input.skip = req.query.limit * req.query.offset || 0;
    input.record = {};
    return new bluebird((resolve) => {
      resolve(input);
    })
      .then(params => {
        // console.log("params =>", params);
        return bluebird.all([
          groupService.findLimit(params.query, params.record, params.skip, params.limit),
          groupService.getCount(params.query)
        ])
      })
      .spread((data, count) => {
        res.status(200)
          .json({ count, data });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json(error);
      });
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.list_details = async (req, res) => {
  try {
    let input = {};
    input.query = {};

    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }

    if (req.query.groupId) {
      input.query._id = req.query.groupId;
    }

    // input.limit = req.query.limit || 10;
    // input.skip = req.query.limit*req.query.offset || 0;
    input.record = {};
    return new bluebird((resolve) => {
      resolve(input);
    })
      .then(params => {
        // console.log("params =>", params);
        return bluebird.all([
          groupService.findLimit_details(params.query, params.record),
          groupService.getCount(params.query)
        ])
      })
      .spread((data, count) => {
        res.status(200)
          .json({ count, data });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json(error);
      });
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};


module.exports.find = async (req, res) => {
  try {
    const _id = req.params.id;
    let group = await groupService.getOne({ _id });
    if (!group) {
      res.sendBadRequest("Group doesnot exists.");
      return;
    }
    res.sendSuccess(group);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.find_details = async (req, res) => {
  try {
    const _id = req.params.id;
    let group = await groupService.getOne_details({ _id });
    if (!group) {
      res.sendBadRequest("Group doesnot exists.");
      return;
    }
    res.sendSuccess(group);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};


module.exports.update = async (req, res) => {
  try {
    const input = req.body;
    console.log(input);
    let query = {
      _id: req.params.id,
    };
    let group = await groupService.getOne(query);
    if (!group) {
      res.sendBadRequest("Group doesnot exists. Provide valid input.");
      return;
    }
    input.updatedAt = new Date();
    for (j = 0; j < group.users.length; j++) {
      console.log(input.users.includes(String(group.users[j])))
      if (!input.users.includes(String(group.users[j]))) {
        console.log("update user empty", group.users[j]);
        let userupdate = await userService.updateOne({ _id: new mongoose.Types.ObjectId(group.users[j]) }, { groups: [], storeType: "" });
      }
    }
    for (j = 0; j < input.users.length; j++) {
      console.log(group.users.includes(input.users[j]))
      if (!group.users.includes(input.users[j])) {
        console.log("update user adding", input.users[j]);
        let userupdate = await userService.updateOne({ _id: new mongoose.Types.ObjectId(input.users[j]) }, { groups: [group._id], storeType: "group" });
      }
    }


    await groupService.updateOne(query, input);
    if (input.active == false) {
      let storesNames = "";
      group.stores.forEach(element => {
        storesNames = storesNames + " " + element.name + ",";
      });

      let alertInsertData = {
        name: 'Group Delete',
        description: group.groupName + ' with store list ' + storesNames + ' has been deleted',
        category: 'Group Delete',
        clientNotification: true,
        brandId: req.user.brandId,
        user: req.user._id
      };

      await alertsServices.insert(alertInsertData);
    }
    res.sendSuccess("Success! Group Updated Successfully.");
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

    let group = await groupService.getOne(query);
    if (!group) {
      res.sendBadRequest("Store doesnot exists. Provide valid input.");
      return;
    }

    await groupService.updateOne(query, { active: false });
    res.sendSuccess("Success! group deleted successfully.");
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};


module.exports.getGroupforToolbar = async (req, res) => {
  try {
    let query = {};
    query.brandId = req.user.brandId;
    query.active = true;
    query.groupName = { $exists: true };


    let record = {
      groupName: 1, description: 1
    }

    let group = await groupService.getMany(query, record);
    if (!group) {
      res.sendNoContent("groups doesnot exists.");
      return;
    }
    res.sendSuccess(group);
  } catch (error) {
    if (error.name === "ValidationError")
      res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};