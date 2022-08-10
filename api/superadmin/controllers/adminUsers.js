/**
 * @name api_stores_controllers_store
 * @description Users Controller
 */

// services
const userService = require("../services/adminUsers"),
  _ = require("lodash"),
  tokenService = require("../../auth/services/tokens"),
  utils = require("../../core/modules/utils"),
  crypto = require("../../core/modules/crypto"),
  bluebird = require("bluebird");
  const brandService = require("../services/brand");
  const storeService = require('../../stores/services/stores');
  const email = require("../../core/modules/email/index");
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

    await userService.updateOne(query, input);
    res.sendSuccess("Success! Account updated successfully.");
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
    let query = {};

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

    if(req.query.role && req.query.role == 'admin'){
      input.query.role = 'admin';
    }else if (req.query.role && req.query.role == 'user') {
      input.query.role = 'user';
    } else {
      input.query.role = { $in: ['admin', 'user'] };
    }    

    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }

    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }

    input.record ={};
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

module.exports.listwithoutlimit = async (req, res) => {
  try {
    let input = {};
    input.query = {};

    if(req.query.role && req.query.role == 'admin'){
      input.query.role = 'admin';
    }else if (req.query.role && req.query.role == 'user') {
      input.query.role = 'user';
    } else {
      input.query.role = { $in: ['admin', 'user'] };
    }    

    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }

    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }

    input.record ={};
    
    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        // console.log("params =>", params);
        return bluebird.all([
          userService.findLimit(
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

module.exports.createusers = (req, res) => {
  const input = req.body;
  return new bluebird((resolve) => {
      let query = {
          email: input.email,
          brandId:req.body.brandId
      };

      if (input.phone)
          query.phone = input.phone;

      input.password = input.phone;

      resolve(query);
  })
      .then(query => {
          const getCurrentUser = { brandId:req.body.brandId };
          return bluebird.all([
              userService.getOne(query),
              userService.getCount(getCurrentUser),

          ]);
      })
      .spread((user, count) => {
          if (user) {
              res.sendBadRequest('Email/Phone already exists. Provide valid input.');
              return;
          }

          return crypto.encrypt(_.get(input, 'password', ''))
              .then(password => {
                  input.password = password;
                  input.clientIndex = count + 1;
                  // input.status = true;
                  return userService.insert(input);
              })
              .then(record => {
                  const certifyUser = {
                      token: utils.getUuid(),
                      user: record._id,
                      type: 'verify-user'
                  };

                  return bluebird.all([
                      tokenService.insert(certifyUser)
                      // email.sendUserCreationEmail({
                      //     token: certifyUser.token,
                      //     email: input.email,
                      //     password: input.password
                      // })
                  ]);
              })
              .then(() => {
                  res.sendSuccess('Success! Please verify your email to activate your account.')
              });
      })
      .catch(error => {
          if (error.name === 'ValidationError')
              res.sendBadRequest(error);
          else
              res.sendServerError(error);
      });

};

module.exports.find_brandUsers = async (req, res) => {
  try {
    const brandId = req.params.id;

    let user = await userService.getMany({ brandId});
    let brandDetails= await brandService.getMany({_id:brandId})
    let storeDetails= await storeService.getMany({brandId})

    if (!user) {
      res.sendBadRequest("Brand doesnot exists. Provide valid input.");
      return;
    }

    let data={
      brandDetails,
      user,
      storeDetails
    }

    res.sendSuccess(data);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

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
    console.log("req.user.role =>", req.user.role);
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