/**
 * @name api_stores_controllers_store
 * @description Users Controller
 */

// services
const userService = require(".././services/users"),
  tokenService = require("../.././auth/services/tokens"),
  utils = require("../.././core/modules/utils"),
  crypto = require("../.././core/modules/crypto"),
  bluebird = require("bluebird"),
  _ = require('lodash');
const email = require("../../core/modules/email/index");
const env = require("../../../config/env/index");
const alertsServices = require('../../alerts/services/alerts');
const storeService = require("../../stores/services/stores");
const groupService = require("../../groups/services/groups");
const brandService = require("../../superadmin/services/brand");
const mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId;

module.exports.create = (req, res) => {
  const input = req.body;
  input.password = utils.getUuid();
  return new bluebird((resolve) => {
    let query = {
      email: input.email,
    };

    if (input.phone) query.phone = input.phone;

    resolve(query);
  })
    .then((query) => {
      const getCurrentUser = { _id: req.user };
      const getcurrentBrandUserCOunt = { brandId: req.user.brandId || input.brandId };
      return bluebird.all([
        userService.getOne(query),
        userService.getCount(getcurrentBrandUserCOunt),
        userService.getOne(getCurrentUser),
      ]);
    })
    .spread((user, count, adminUser) => {
      if (user) {
        res.sendBadRequest("Email/Phone already exists. Provide valid input.");
        return;
      }

      return crypto
        .encrypt(_.get(input, "password", ""))
        .then((password) => {
          input.password = password;
          input.clientIndex = count + 1;

          if (req.user.role && req.user.role == "superadmin" || req.user.role == "admin" || req.user.role == "user" && input.brandId) {
            input.brandId = input.brandId;
          } else {
            input.brandId = adminUser.brandId;
          }

          input.active = false;
          delete input['password'];
          return userService.insert(input);
        })
        .then((record) => {
          const certifyUser = {
            token: utils.getUuid(),
            user: record._id,
            type: "verify-user",
          };

          let alertInsertData = {
            name: 'User Added',
            description: input.name + ' has been successfully onboarded to the platform ',
            category: 'Add User',
            clientNotification: true,
            brandId: req.user.brandId || input.brandId,
            user: req.user._id
          };
          return bluebird.all([
            tokenService.insert(certifyUser),
            email.sendUserCreationEmail({
              token: certifyUser.token,
              email: input.email,
              // password: input.password,
              url: env.uiDomainName + "auth/set-password?t=" + certifyUser.token
            }),
            alertsServices.insert(alertInsertData)
          ]);
        })
        .then(() => {
          res.sendSuccess(
            "Success! Please verify your email to activate your account."
          );
        });
    })
    .catch((error) => {
      console.log("error =>", error);
      if (error.name === "ValidationError") res.sendBadRequest(error);
      else res.sendServerError(error);
    });
};

module.exports.update = async (req, res) => {
  try {
    const input = req.body;

    let query = {
      _id: req.params.id,
    };

    let user = await userService.getOne(query);
    if (!user) {
      res.sendBadRequest("User doesnot exists. Provide valid input.");
      return;
    }
    input.updatedAt = new Date();
    let userUpdateData = await userService.updateOne(query, input);
    let updatedUser = await userService.getOne(query);
    // console.log("updatedUser =>", updatedUser);
    if (input.active == false) {
      let alertInsertData = {
        name: 'User Deactive',
        description: updatedUser.name + ' has been deactived, if you still want to active them back please click on the link for activation <a href="' + env.uiDomainName + 'control-panel/assign-role" > ' + env.uiDomainName + 'control-panel/assign-role</a>',
        category: 'Deactivate User',
        clientNotification: true,
        brandId: req.user.brandId || input.brandId,
        user: req.user._id
      };
      await alertsServices.insert(alertInsertData);
    }

    if (input && !input.active) {
      let alertInsertData = {
        name: 'User Updated',
        description: updatedUser.name + ' has been successfully updated',
        category: 'Update User',
        clientNotification: true,
        brandId: req.user.brandId || input.brandId,
        user: req.user._id
      };
      await alertsServices.insert(alertInsertData);
    }

    if (input.storeType == "single") {
      if (updatedUser.stores.name && updatedUser.stores.name != '') {
        let alertInsertData = {
          name: 'Store Assigned',
          description: updatedUser.stores[0].name + ' has been assigned to you',
          category: 'Assign Store',
          clientNotification: true,
          brandId: req.user.brandId || input.brandId,
          user: req.user._id
        };
        await alertsServices.insert(alertInsertData);
      }
    }

    if (input.storeType == "group") {
      let storesList = [];
      let groupsList = [];
      updatedUser.groups.forEach(element => {
        groupsList.push(element._id)
        element.stores.forEach(element1 => {
          storesList.push(element1);
        });
      });

      let findStoresQuery = { _id: { $in: storesList } };
      let record = { name: 1 };
      let getstoresName = await storeService.find(findStoresQuery, record);
      let storesNames = "";
      getstoresName.forEach(element2 => {
        storesNames = storesNames + " " + element2.name + ",";
      });

      let findGroupsQuery = { _id: { $in: groupsList } };
      let groupRecord = { groupName: 1 };
      let getGroupsName = await groupService.find(findGroupsQuery, groupRecord);
      let groupsName = "";
      getGroupsName.forEach(element3 => {
        groupsName = groupsName + " " + element3.groupName + ",";
      });
      let alertInsertData = {
        name: 'Group Assigned',
        description: groupsName + ' with store list ' + storesNames + ' has been assigned to you',
        category: 'Assign Group',
        clientNotification: true,
        brandId: req.user.brandId || input.brandId,
        user: req.user._id
      };
      await alertsServices.insert(alertInsertData);
    }
    res.sendSuccess("Success! Account Updated Successfully.");
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

    let user = await userService.getOne(query);
    if (!user) {
      res.sendBadRequest("User doesnot exists. Provide valid input.");
      return;
    }

    await userService.updateOne(query, { active: false });
    res.sendSuccess("Success! Account deleted successfully.");
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.list_old = async (req, res) => {
  try {
    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }
    let query = {
      brandId: req.brandId,
    };

    let user = await userService.getMany(query);
    res.sendSuccess(user);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.list = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    if (req.user._id) {
      input.query._id = { $ne: req.user._id };
    }

    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }

    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }

    if (req.query.role) {
      input.query.role = req.query.role;
    }

    input.record = {};
    input.limit = req.query.limit || 10;
    input.skip = req.query.limit * req.query.offset || 0;

    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        // console.log("params =>", params);
        return bluebird.all([
          userService.findLimit(
            params.query,
            params.record,
            params.skip,
            params.limit
          ),
          userService.getCount(params.query),
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

module.exports.listWithoutLimit = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    if (req.user._id) {
      input.query._id = { $ne: req.user._id };
    }

    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }

    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }

    input.record = {};

    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        // console.log("params =>", params);
        return bluebird.all([
          userService.findWithoutLimit(
            params.query,
            params.record
          ),
          userService.getCount(params.query),
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
  try {
    const _id = req.params.id;

    let user = await userService.getOne({ _id });
    if (!user) {
      res.sendBadRequest("User doesnot exists. Provide valid input.");
      return;
    }

    res.sendSuccess(user);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.validate = async (req, res, next) => {
  try {
    const input = req.body;
    let validate_error = "";
    return bluebird
      .all([
        this.validate_email(input, req.params.id),
        this.validate_phone(input, req.params.id),
      ])
      .spread((email, phone) => {
        if (email != "") {
          // validate_error.push("Email Id");
          validate_error = validate_error + "Email Id, ";
        }
        if (phone != "") {
          // validate_error.push("Phone Number");
          validate_error = validate_error + "Phone Number, ";
        }
      })
      .then(() => {
        if (validate_error.toString().length > 0) {
          res.sendServerError(validate_error + "Already Exist");
          return;
        }
        next();
      });
  } catch (error) {
    // console.log("error =>", error)
    res.sendServerError(error);
    return;
  }
};

module.exports.validate_email = async (input) => {
  try {
    let query = {
      email: input.email,
    };
    let validate_e = await Promise.all([
      userService.getOne(query),
    ]);
    if (validate_e[0] != null) {
      return "Email";
    }
    return "";
  } catch (error) {
    return error;
  }
};

module.exports.validate_phone = async (input) => {
  try {
    let query = {
      phone: input.phone,
    };
    let validate_p = await Promise.all([
      userService.getOne(query),
    ]);
    if (validate_p[0] != null) {
      return "Phone";
    }
    return "";
  } catch (error) {
    return error;
  }
};


module.exports.createMultipleUsers = async (req, res) => {


  let errText = ''
  var result = {}
  try {
    if (req.body.validateddata.length > 0) {
      const input = req.body.validateddata;
      const inputData = {}

      for (var i = 0; i < input.length; i++) {
        if (input[i].phone != "" && input[i].email != "") {
          let emailQuery = {
            email: input[i].email,
            brandId: input[i].brandId ? input[i].brandId : req.user.brandId
          }
          let phoneQuery = {
            phone: input[i].phone,
            brandId: input[i].brandId ? input[i].brandId : req.user.brandId
          }

          if (req.user.role && req.user.role == "storesuperadmin" || req.user.role && req.user.role == "superadmin" || req.user.role == "admin" ||
            req.user.role == "user" && input[i].brandId) {
            inputData.brandId = input[i].brandId;
          } else {
            inputData.brandId = req.user.brandId;
          }
          let isEmailExist = await userService.getOne(emailQuery)
          let isPhoneExist = await userService.getOne(phoneQuery)

          if (isEmailExist == null && isPhoneExist == null) {
            inputData.name = input[i].name;
            inputData.email = input[i].email;
            inputData.phone = input[i].phone;
            inputData.role = input[i].role;
            inputData.brandId = req.user.brandId || input[i].brandId;
            userService.insert(inputData)
              .then((record) => {
                const certifyUser = {
                  token: utils.getUuid(),
                  user: record._id,
                  type: "verify-user",
                };

                bluebird.all([
                  tokenService.insert(certifyUser),
                  email.sendUserCreationEmail({
                    token: certifyUser.token,
                    email: record.email,
                    url: env.uiDomainName + "auth/set-password?t=" + certifyUser.token
                  })
                ]);
              })
          } else {
            errText += input[i].email + ", "
          }
        } else {
          errText += input[i].email + ", "
        }

        if (i + 1 == input.length) {
          console.log("Err Data=>", errText)
          if (errText != '')
            res.sendBadRequest({ data: errText })
          else
            result.data = 'Success'
          result.message = req.body.error_msg
          res.sendSuccess(result)
        }
      }
    } else {
      result.data = 'Success'
      result.message = req.body.error_msg
      res.sendSuccess(result)
    }

  } catch (error) {
    res.sendServerError(error);
    return error;
  }
};

module.exports.update_validate = async (req, res, next) => {
  try {
    const input = req.body;
    let validate_error = "";
    if (input.email || input.phone) {
      return bluebird
        .all([
          this.update_validate_email(input, req.params.id),
          this.update_validate_email(input, req.params.id),
        ])
        .spread((email, phone) => {
          if (email != "") {
            // validate_error.push("Email Id");
            validate_error = validate_error + "Email Id, ";
          }
          if (phone != "") {
            // validate_error.push("Phone Number");
            validate_error = validate_error + "Phone Number, ";
          }
        })
        .then(() => {
          if (validate_error.toString().length > 0) {
            res.sendServerError(validate_error + "Already Exist");
            return;
          }
          next();
        });
    } else {
      next();
    }
  } catch (error) {
    // console.log("error =>", error)
    res.sendServerError(error);
    return;
  }
};

module.exports.update_validate_email = async (input, id) => {
  try {
    let query = {
      email: input.email,
      _id: { $nin: [id] }
    };

    console.log("query =>", query);
    let validate_e = await Promise.all([
      userService.getOne(query),
    ]);
    if (validate_e[0] != null) {
      return "Email";
    }
    return "";
  } catch (error) {
    return error;
  }
};

module.exports.update_validate_phone = async (input, id) => {
  try {
    let query = {
      phone: input.phone,
      _id: { $nin: [id] }
    };
    console.log("query =>", query);
    let validate_p = await Promise.all([
      userService.getOne(query),
    ]);
    if (validate_p[0] != null) {
      return "Phone";
    }
    return "";
  } catch (error) {
    return error;
  }
};

module.exports.search = async (req, res) => {
  try {
    const _id = req.body.key;
    let query = {
      brandId: req.body.brandId ? req.body.brandId : req.user.brandId,
      name: { '$regex': req.body.key, $options: "$i" }
    }
    let user = await userService.getSearchResult(query);
    if (!user) {
      res.sendBadRequest("Users doesnot exists.");
      return;
    }

    res.sendSuccess(user);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.bulkUploademailValidator = async (req, res, next) => {
  try {
    const bodyData = req.body;
    let returndata = []
    let validate_error = [];
    let invaildemail = []
    let existsemail = []
    var response = ""
    console.log("InputDAta", bodyData)
    for (var i = 0; i < bodyData.length; i++) {
      if (!bodyData[i].hasOwnProperty("email") || bodyData[i].email == "") {
        validate_error.push("Email Required");
      } else {
        var validRegex =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (bodyData[i].hasOwnProperty("email") && bodyData[i].email.match(validRegex)) {
          let query = { email: bodyData[i].email }
          let existuser = await userService.getOne(query)
          if (existuser != null) {
            existsemail.push(existuser.email)
          } else {
            console.log("--------------------------");
            returndata.push(bodyData[i])
          }
        } else {
          invaildemail.push(bodyData[i].email)
        }
      }
      if (i == bodyData.length - 1) {
        console.log("existsemail", String(existsemail))
        console.log("invaildemail", String(invaildemail))
        if (invaildemail.toString().length > 0) {
          response = response + String(invaildemail) + " Invalid emails";
        }
        if (String(existsemail).length > 0) {
          response = response + " & " + String(existsemail) + "  is already Exist"
        }
        console.log("response", response)
        req.body.validatedemail = returndata
        req.body.email_error_msg = response
        next();
      }
    }

  } catch (error) {
    console.log("error =>", error)
    res.sendServerError(error);
    return;
  }
};

module.exports.bulkUploadphoneValidator = async (req, res, next) => {
  console.log(req.body)
  let result = {}
  if (req.body.validatedemail.length > 0) {
    const bodyData = req.body.validatedemail;
    let Invalidphone = []
    let existphone = []
    let returndata = []
    let response = ''
    for (var i = 0; i < bodyData.length; i++) {
      if (!bodyData[i].hasOwnProperty("phone") || bodyData[i].phone == "") {
      } else {
        console.log(String(bodyData[i].phone).length)
        if (bodyData[i].hasOwnProperty("phone") && String(bodyData[i].phone).length == 10) {
          console.log(bodyData[i].phone)
          let query = { phone: bodyData[i].phone }
          let existuser = await userService.getOne(query)
          if (existuser != null) {
            existphone.push(existuser.phone)
          } else {
            returndata.push(bodyData[i])
          }
        } else {
          Invalidphone.push(bodyData[i].phone)
        }
      }
      if (i == bodyData.length - 1) {
        console.log("Invalidphone", String(Invalidphone))
        console.log("existphone", String(existphone))
        if (String(existphone).length > 0) {
          response = response + " & " + String(existphone) + "  is already Exist"
        }
        if (String(Invalidphone).length > 0) {
          response = response + " & " + String(Invalidphone) + "  is already invalid"
        }
        console.log("response", response)
        req.body.validateddata = returndata
        req.body.error_msg = req.body.email_error_msg + response
        next();
      }
    }
  } else {
    result.data = 'Success'
    result.message = req.body.email_error_msg
    res.sendSuccess(result)

  }



}
module.exports.userlimit = async (req, res, next) => {
  try {
    let input = {};
    input.query = {};
    if (req.user.brandId) {
      input.query._id = req.user.brandId;
    }
    if (req.query._id) {
      input.query._id = req.query._id;
    }
    // console.log("req.user.role =>", req.user.role);
    if(req.user.role == "superadmin" || req.user.role == "admin" || req.user.role == "user"){
      next();
    }else{
      let brandConfigs = await brandService.getOne(input.query);
      if (req.body.length <= brandConfigs.uploadLimit.user) {
        next();
      } else {
        return res.sendBadRequest(
          `User count has exceeded limit...! maximum count ${brandConfigs.uploadLimit.user}`
        );
      }
    }
  } catch (error) {
    console.error(error);
    return res.sendServerError(error);
  }
}

module.exports.assignGroup = async (req, res) => {
  try {
    const input = req.body;

    let userQuery = {
      _id: req.params.id,
    };
    if(input.storeType == "group"){
      let groupQuery = {
        _id: req.body.groups,
      };
  
      let getuser = await userService.getOne(userQuery);
      let getgroup = await groupService.getOne(groupQuery);
  
      if (!getuser._id) {
        res.sendBadRequest("invalid user");
      }
  
      if (!getgroup._id) {
        res.sendBadRequest("invalid group");
      }  
     
      let addedgroups = [];
      let groupslist = getuser.groups;
      if(groupslist.length>0){
        groupslist.forEach((element, index) => {
          if(!addedgroups.includes(element.groups))
          if(element.groups)
            addedgroups.push(element.groups);
        });
      }
  
      input.groups.forEach(element => {
        addedgroups.push(element);
      });   
      addedgroups = [...new Set(addedgroups)]
      let updateUserData = {
        groups: addedgroups,
        storeType:input.storeType
      }
      // console.log("userQuery =>", userQuery);
      // console.log("updateUserData =>", updateUserData);
      let updateuser = await userService.updateOne(userQuery,updateUserData)
  
      input.groups.forEach(async (element) => {
        let addedusers = [];
        let userslist = getgroup.users;
        if(userslist.length>0){
          userslist.forEach((element1, index) => {
            console.log("element1 =>", element1);
            if(element1 && element1 !=null){
              if(!addedusers.includes(element1))
                if(element1._id)
                  addedusers.push(element1._id);
            }
          });
        }
          let useradd =true;
          addedusers.forEach((element)=>{
            if(String(element)==String(req.params.id)){   
              useradd = false
            }
          })
        if(useradd){
          addedusers.push(new mongoose.Types.ObjectId(req.params.id));  
        }
        let updateGroupData = {
          users: addedusers
        };  

        // console.log("groupQuery =>", {_id:element});
        // console.log("updateGroupData =>", updateGroupData);
        let updategroup = await groupService.updateOne({_id:element},updateGroupData)
      });

      res.sendSuccess("Success! Group Assign Successfully.")
    }else if(input.storeType == "single"){
      let updateUserData = {};
      updateUserData.storeType = input.storeType;
      updateUserData.stores = input.stores;
      updateUserData.groups = [];
      let updateuser = await userService.updateOne(userQuery,updateUserData);

      res.sendSuccess("Success! Store Assign Successfully.")
    }    
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.overAllUsers = async (req, res) => {
  try {
    let input = {};
    input.query = { role:{$ne:'superadmin'}};
    input.record = {name:1,email:1,brandId:1};

    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        // console.log("params =>", params);
        return bluebird.all([
          userService.find(
            params.query,
            params.record
          )
        ]);
      })
      .spread((data) => {
        res.status(200).json({ data });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};