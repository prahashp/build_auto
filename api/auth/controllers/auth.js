/**
 * @name api_auth_controllers_auth
 * @description Authentication Controller
 */

// NPM Modules
const { Promise } = require("bluebird");
const _ = require("lodash"),
  bluebird = require("bluebird"),
  // custom modules
  crypto = require("../.././core/modules/crypto"),
  utils = require("../.././core/modules/utils"),
  email = require("../.././core/modules/email"),
  sms = require("../.././core/modules/sms"),
  brandService = require("../../superadmin/services/brand"),
  OTPClass = require("../.././core/modules/sms/OTPVerification.class");
// services
const userService = require("../.././users/services/users"),
  tokenService = require(".././services/tokens"),
  storeService = require("../../stores/services/stores"),
  cameraService = require("../../camera/services/camera"),
  groupService = require("../../groups/services/groups");
////2FA////
const speakeasy = require("speakeasy"),
  QRCode = require("qrcode");

const db = require("../../../config/database/postgres");
const envData = require("../../../config/env/index");
const { listeners } = require("../models/token");
// SignUp / Register
module.exports.signup = async (req, res) => {
  const input = req.body;
  try {
    let count = await Promise.all([
      userService.getCount(),
      brandService.getCount(),
    ]);
    // console.log("input =>", input);
    let brand_insert = await this.brand(input, count);
    // console.log("brand_insert =>", brand_insert);
    let users = await userService.insert(brand_insert);
    let userIdUpdate = await brandService.updateOne(
      { _id: brand_insert.brandId },
      { userId: users._id }
    );
    if (userIdUpdate.acknowledged == true) { 
      let pg_sync = await this.signUpSyncing(brand_insert);
    }
    let otp = bluebird.all([this.signUpEmailotp(users)]);
    return res.sendSuccess(
      "Success! Please verify your email activate your account."
    );
  } catch (error) {
    console.log("error =>", error);
    console.error(error);
    return res.sendServerError(error);
  }
};

//brand insert
module.exports.brand = async (data, count) => {
  try {
    const brandInput = {};
    let password = await crypto.encrypt(_.get(data, "password", ""));
    brandInput.brandIndex = count[1] + 100;
    brandInput.brandName = data.brandName;
    brandInput.email = data.email;
    brandInput.phone = data.phone;
    brandInput.dialCode = data.dialCode;
    brandInput.store_info_count = data.store_info_count;
    brandInput.store_sqft = data.store_sqft;
    brandInput.subscription = data.subscription;
    let newBrandId = await brandService.insert(brandInput);
    data.brandId = newBrandId._id;
    data.password = password;
    data.clientIndex = count[1] + 100;
    data.refreshToken = utils.getUuid()
    return data;
  } catch (error) {
    return error;
  }
};

module.exports.signUpSyncing = async (mongoData) => {
  try {
    let query = `INSERT INTO edgeapp.client(client_id,name, language, status, is_active) values ($1,$2,'en',1,1)`;
    let data = await db.query(query, [mongoData.clientIndex, mongoData.name]);
    if (data.rowCount > 0) {
      return "SuccessFully Synced with Postgres";
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};

// Account Verify
module.exports.verify = (req, res) => {
  const query = {
    token: _.get(req.body, "token", null),
    type: "verify-user",
  };

  tokenService
    .getOne(query)
    .then((record) => {
      if (!record) {
        res.sendBadRequest("The token has been expired.");
        return;
      }

      const userQuery = {
        _id: record.user._id,
      };

      return bluebird
        .all([
          userService.updateOne(userQuery, {
            active: true,
            updatedAt: new Date(),
          }),

          tokenService.deleteOne({
            _id: record._id,
          }),
        ])
        .then(() => {
          res.sendSuccess("User Account has been activated!");
        });
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

// Login
module.exports.login = (req, res) => {
  // const query = {
  //     active: true
  // };
  let query = {};

  crypto
    .encrypt(_.get(req.body, "password", ""))
    .then((password) => {
      query.password = password;
      query.$or = [
        { email: _.get(req.body, "username", "") },
        { phone: _.get(req.body, "username", "") },
      ];

      return userService.getOne(query);
    })
    .then((user) => {
      if (!user) {
        res.sendUnauthorized("Please provide valid credentials");
        return;
      }

      if (
        (user.role && user.role == "superadmin") ||
        user.role == "admin" ||
        user.role == "user"
      ) {
        ////2FA Conditions////
        var data_url = "";
        if (user.isTwoFactorAuthenticationEnabled) {
          let result = {};
          result.qrcode = user.qrcode;
          result.userId = user._id;
          return res.sendSuccess(result);
        } else {
          var secret = speakeasy.generateSecret();
          QRCode.toDataURL(secret.otpauth_url, async function (err, data_url) {
            /////////update users/////////
            var twoFactorAuthenticationCode = secret.base32;
            var isTwoFactorAuthenticationEnabled = "true";

            const updateQuery = {
              _id: user._id,
            };

            const payload = {};
            payload.twoFactorAuthenticationCode = twoFactorAuthenticationCode;
            payload.isTwoFactorAuthenticationEnabled =
              isTwoFactorAuthenticationEnabled;
            payload.qrcode = data_url;

            const updatedUser = await userService.updateOne(
              updateQuery,
              payload
            );
            const userdata = await userService.findOne(updateQuery);
            let result = {};
            result.qrcode = userdata.qrcode;
            result.userId = userdata._id;
            return res.sendSuccess(result);
          });
        }
      } else {
        if (user.active && user.active == true) {
          const authToken = {
            token: utils.getUuid(),
            refreshToken: utils.getUuid(),
            user: user._id,
            type: "access-token",
          };
          return tokenService.insert(authToken).then(() => {
            res.sendSuccess({
              accessToken: authToken.token,
              refreshToken: authToken.refreshToken,
            });
          });
        } else {
          bluebird.all([this.signUpEmailotp(user)]);
          res.sendInactiveError(
            "Please verify your email to activate your account"
          );
          return;
        }
      }
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

// Users Login
module.exports.userLogin = (req, res) => {
  let query = {};
  crypto
    .encrypt(_.get(req.body, "password", ""))
    .then((password) => {
      query.password = password;
      query.$or = [
        { email: _.get(req.body, "username", "") },
        { phone: _.get(req.body, "username", "") },
      ];

      return userService.getOne(query);
    })
    .then(async (user) => {
      console.log(user);
      if (!user) {
        res.sendUnauthorized("Please provide valid credentials");
        return;
      }

      if (
        (user.role && user.role == "storesuperadmin") ||
        user.role == "storeadmin" ||
        user.role == "storeuser"
      ) {
        if (user.email_verify && user.email_verify == true) {
          if (user.active && user.active == true) {
            const authToken = {
              token: utils.getUuid(),
              refreshToken: utils.getUuid(),
              user: user._id,
              type: "access-token",
            };
            var updateuse = await userService.updateOne({ _id: user._id }, { refreshToken: authToken.refreshToken })
            return tokenService.insert(authToken).then(() => {
              res.sendSuccess({
                accessToken: authToken.token,
                refreshToken: authToken.refreshToken,
              });
            });
          } else {
            bluebird.all([this.signUpEmailotp(user)]);
            res.sendInactiveError("Sorry! Your account not activated");
            return;
          }
        } else {
          bluebird.all([this.signUpEmailotp(user)]);
          res.sendInactiveError(
            "Please verify your email to activate your account"
          );
          return;
        }
      } else {
        res.sendUnauthorized("Sorry! Your login not allowed here");
        return;
      }
    })
    .catch((error) => {
      console.log("error =>", error);
      res.sendServerError(error);
    });
};

// Admin Login
module.exports.adminLogin = (req, res) => {
  let query = {};

  crypto
    .encrypt(_.get(req.body, "password", ""))
    .then((password) => {
      query.password = password;
      query.$or = [
        { email: _.get(req.body, "username", "") },
        { phone: _.get(req.body, "username", "") },
      ];

      return userService.getOne(query);
    })
    .then((user) => {
      if (!user) {
        res.sendUnauthorized("Please provide valid credentials");
        return;
      }

      if (
        (user.role && user.role == "superadmin") ||
        user.role == "admin" ||
        user.role == "user"
      ) {
        if (user.email_verify && user.email_verify == true) {
          if (user.active && user.active == true) {
            ////2FA Conditions////
            var data_url = "";
            if (user.isTwoFactorAuthenticationEnabled) {
              let result = {};
              result.qrcode = user.qrcode;
              result.userId = user._id;
              // console.log("just check");
              return res.sendSuccess(result);
            } else {
              var secret = speakeasy.generateSecret();
              QRCode.toDataURL(
                secret.otpauth_url,
                async function (err, data_url) {
                  /////////update users/////////
                  var twoFactorAuthenticationCode = secret.base32;
                  var isTwoFactorAuthenticationEnabled = "true";

                  const updateQuery = {
                    _id: user._id,
                  };

                  const payload = {};
                  payload.twoFactorAuthenticationCode =
                    twoFactorAuthenticationCode;
                  payload.isTwoFactorAuthenticationEnabled =
                    isTwoFactorAuthenticationEnabled;
                  payload.qrcode = data_url;

                  const updatedUser = await userService.updateOne(
                    updateQuery,
                    payload
                  );
                  const userdata = await userService.findOne(updateQuery);
                  let result = {};
                  result.qrcode = userdata.qrcode;
                  result.userId = userdata._id;
                  return res.sendSuccess(result);
                }
              );
            }
          } else {
            res.sendUnauthorized("Sorry! Your account not activated");
            return;
          }
        } else {
          bluebird.all([this.signUpEmailotp(user)]);
          res.sendInactiveError(
            "Please verify your email to activate your account"
          );
          return;
        }
      } else {
        res.sendUnauthorized("Sorry! Your login not allowed here");
        return;
      }
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

// QR verify
module.exports.qrverify = async (req, res) => {
  try {
    // console.log("req.body =>", req.body);
    let user = await userService
      .findOne({
        _id: req.body.userId,
      })
      .catch((error) => {
        throw new Error(error);
      });

    // console.log("user =>"+user);
    // console.log("user =>"+user.twoFactorAuthenticationCode);

    var token = req.body.otp;

    // console.log("user.twoFactorAuthenticationCode =>", user.twoFactorAuthenticationCode);
    const secret = user.twoFactorAuthenticationCode;
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    });
    // console.log(verified)
    if (verified) {
      ////remove QR code///////
      const query = {
        _id: req.body.userId,
      };

      const payload = {};
      payload.qrcode = "";

      const updatedUser = await userService.updateOne(query, payload);

      const authToken = {
        token: utils.getUuid(),
        refreshToken: utils.getUuid(),
        user: user._id,
        type: "access-token",
      };
      return tokenService.insert(authToken).then(() => {
        res.sendSuccess({
          accessToken: authToken.token,
          refreshToken: authToken.refreshToken,
        });
      });
    } else {
      res.sendUnauthorized("code expired");
    }
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// User's Profile
module.exports.me = async (req, res) => {
  if (req.user.role && (req.user.role == "superadmin" || req.user.role == "admin" || req.user.role == "user")) {
    return res.sendSuccess({ user: req.user });
  }

  let brandData = await brandService.getOne({ _id: req.user.brandId });
  let input = {};
  if (brandData) {
    (input.user = req.user), (input.brand = brandData);
  }

  return res.sendSuccess(input);
};

// Auth Token old
module.exports.token_old = (req, res) => {
  const query = {
    token: req.token,
    user: req.user._id,
    type: "access-token",
    refreshToken: _.get(req.body, "refreshToken", ""),
  };

  tokenService
    .getOne(query)
    .then((record) => {
      const document = {
        token: utils.getUuid(),
        user: req.user._id,
        type: "access-token",
        refreshToken: _.get(req.body, "refreshToken", ""),
      };

      return bluebird.all([
        tokenService.insert(document),
        tokenService.deleteOne({ _id: record._id }),
      ]);
    })
    .spread((record) => {
      res.sendSuccess({
        accessToken: record.token,
      });
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};
// Auth Token new
module.exports.token = (req, res) => {
  const token = _.get(req.headers, "authorization", "").split(" ")[1];
  const query = {
    token: token,
    type: "access-token"
  };
  tokenService
    .getOne(query)
    .then(async (tokenrecord) => {
      if (tokenrecord) {
        let user = await userService.getOne({ _id: tokenrecord.user })
        if (!user) {
          res.sendUnauthorized("User not available");
          return;
        }
        req.user = user;
        console.log(req.user);
        let tokens = await this.createnewtoken(req, res)
        let deletetoken = await tokenService.deleteOne({ token: req.token })
        res.sendSuccess({
          accessToken: tokens.token,
        });
      } else {
        let user = await userService.getOne({ refreshToken: req.body.refreshToken })
        if (!user) {
          res.sendUnauthorized("User not available");
          return;
        }
        req.user = user;
        let tokens = await this.createnewtoken(req, res)
        res.sendSuccess({
          accessToken: tokens.token,
        });
      }
    }).catch((error) => {
      console.log("error = >", error);
      res.sendServerError(error);
    });
};

//create new token
module.exports.createnewtoken = async (req, res) => {
  const document = {
    token: utils.getUuid(),
    refreshToken: utils.getUuid(),
    user: req.user._id,
    type: "access-token"
  };
  let updateuser = await userService.updateOne({ _id: req.user._id }, { refreshToken: document.refreshToken })
  return tokenService.insert(document)
}



// Forgot password
module.exports.forgotPasswod = (req, res) => {
  return new bluebird((resolve) => {
    let query = {
      $or: [{ email: req.body.username }, { phone: req.body.username }],
    };

    resolve(query);
  })
    .then((query) => {
      return userService.getOne(query);
    })
    .then((user) => {
      if (!user) {
        res.sendUnauthorized("Please enter valid email/ mobile number");
        return;
      }

      const cerifyToken = {
        token: utils.getOtp(),
        user: user._id,
        type: "forgot-pwd",
      };

      const promises = [tokenService.insert(cerifyToken)];

      if (req.body.username === user.email) {
        promises.push(
          email.sendResetPasswordEmail({
            otp: cerifyToken.token,
            email: user.email,
          })
        );
      } else {
        promises.push(
          sms.sendResetPasswordSms({
            otp: cerifyToken.token,
            phone: "+91" + user.phone,
          })
        );
        // let otpclass = new OTPClass();
        // let mob = '91'+user.phone;
        // promises.push(otpclass.invokeOTP(mob,cerifyToken.token));
      }

      return bluebird.all(promises).then(() => {
        res.sendSuccess("OTP has been send to user's email.");
      });
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

// Check Otp
module.exports.validateOtp = (req, res) => {
  const query = {
    token: _.get(req.body, "otp", null),
    // type: "forgot-pwd",
  };

  tokenService
    .getOne(query)
    .then((record) => {
      // console.log("record =>", record);
      if (!record) {
        res.sendUnauthorized("The OTP has been expired!");
        return;
      }

      const resetPwd = {
        token: utils.getUuid(),
        user: record.user._id,
        type: "reset-pwd",
      };
      return bluebird
        .all([
          tokenService.insert(resetPwd),
          tokenService.deleteOne({ _id: record._id }),
        ])
        .then(() => {
          res.sendSuccess({
            token: resetPwd.token,
          });
        });
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

// Reset Password
module.exports.resetPassword = (req, res) => {
  const query = {
    token: _.get(req.body, "token", null),
    type: "reset-pwd",
  };

  tokenService
    .getOne(query)
    .then((record) => {
      if (!record) {
        res.sendUnauthorized("The Token has been expired!");
        return;
      }

      return crypto
        .encrypt(_.get(req.body, "password", ""))
        .then((password) => {
          // console.log(password);
          // console.log(record.user._id);
          return bluebird
            .all([
              userService.updateOne(
                {
                  _id: record.user._id,
                },
                { password, updatedAt: new Date() }
              ),
              tokenService.deleteOne({
                _id: record._id,
              }),
              userService.getOne({
                _id: record.user._id,
              }),
            ])
            .then((updateuser) => {
              updateuser[2].uiDomainName = envData.uiDomainName;
              email.sendResetPasswordEmailSuccess(updateuser[2]);
              res.sendSuccess("Your password has been changed successfully.");
            });
        });
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

// Set Password
module.exports.setPassword = (req, res) => {
  const query = {
    token: _.get(req.body, "token", null),
    type: "verify-user",
  };

  tokenService
    .getOne(query)
    .then((record) => {
      if (!record) {
        res.sendUnauthorized("The Token has been expired!");
        return;
      }

      return crypto
        .encrypt(_.get(req.body, "password", ""))
        .then((password) => {
          console.log(password);
          console.log(record.user._id);
          return bluebird
            .all([
              userService.updateOne(
                {
                  _id: record.user._id,
                },
                { password, updatedAt: new Date(), active: true }
              ),
              tokenService.deleteOne({
                _id: record._id,
              }),
              userService.getOne({
                _id: record.user._id,
              }),
            ])
            .then((updateuser) => {
              // email.sendResetPasswordEmailSuccess(updateuser[2]);
              res.sendSuccess("Your account activated.");
            });
        });
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

// Check Token
module.exports.checktoken = (req, res) => {
  const query = {
    token: _.get(req.body, "token", null),
  };

  tokenService
    .getOne(query)
    .then((record) => {
      if (!record) {
        res.sendUnauthorized("The Token has been Expired!");
        return;
      } else {
        res.sendSuccess("Valid Token");
      }
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

//Emailotp
module.exports.Emailotp = async (data) => {
  try {
    const cerifyOTP = {
      token: utils.getOtp(),
      user: data._id,
      type: "email-otp",
    };
    const promises = [tokenService.insert(cerifyOTP)];
    await promises.push(
      email.sendEmailOTP({
        otp: cerifyOTP.token,
        email: data.email,
      })
    );
    return promises, "Email";
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

//phoneOTP
module.exports.Phoneotp = async (data) => {
  try {
    const cerifyOTP = {
      token: utils.getOtp(),
      user: data._id,
      type: "phone-otp",
    };
    const promises = [tokenService.insert(cerifyOTP)];
    await promises.push(
      sms.sendPasswordSms({
        otp: cerifyOTP.token,
        phone: "+91" + data.phone,
      })
    );
    return promises, "phone";
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

//validateOTP
module.exports.verifyOTP = async (req, res) => {
  try {
    let currentDate = new Date();
    const query = {
      token: _.get(req.body, "token", null),
      // type: _.get(req.body, "type", null) + "-otp",
      // createdAt: { $gt: new Date(currentDate.getTime() - 60000) },
      // createdAt : { $gt: new Date(currentDate.getTime() - 1000*60) }
    };

    let validate = await tokenService.getOne(query);
    // console.log("query =>", query);
    // console.log("validate =>", validate);
    if (!validate) {
      res.sendBadRequest("The OTP has expired /Not valid");
      return;
    }
    const userQuery = {
      _id: validate.user._id,
    };

    let otp_validate = await bluebird.all([
      tokenService.deleteOne({ _id: validate._id }),
      userService.updateOne(userQuery, {
        active: true,
        updatedAt: new Date(),
        email_verify: true,
      }),
    ]);

    let user_status = await userService.getOne(userQuery);

    if (otp_validate[1].acknowledged == true && user_status.active == true) {
      const authToken = {
        token: utils.getUuid(),
        refreshToken: utils.getUuid(),
        user: user_status._id,
        type: "access-token",
      };
      user_status.uiDomainName = envData.uiDomainName;
      return tokenService.insert(authToken).then(async () => {
        // console.log("newclientreg");

        bluebird.all([this.newClientRegister(user_status)]);

        res.sendSuccess({
          accessToken: authToken.token,
          refreshToken: authToken.refreshToken,
          user_status,
          verified: true,
        });
      });
    } else {
      res.sendUnauthorized("Please verify your email to activate your account");
      return;
    }
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

//ResendOTP
module.exports.ResendOTP = async (req, res) => {
  try {
    const input = req.body;
    let query = {};
    query.$or = [
      { email: _.get(req.body, "userdata", "") },
      { phone: _.get(req.body, "userdata", "") },
    ];
    let userdata = await userService.getOne(query);
    // console.log(userdata, "userdata");
    if (!userdata) {
      res.sendUnauthorized("User not available");
      return;
    }
    const cerifyOTP = {
      token: utils.getOtp(),
      user: userdata._id,
      type: input.type + "-otp",
    };
    // console.log(cerifyOTP, "cerifyOTP");
    if (input.type == "email") {
      let promises = await bluebird.all([
        tokenService.deleteOne({
          user: userdata._id,
          // type: input.type + "-otp",
        }),
        tokenService.insert(cerifyOTP),
        email.sendEmailOTP({
          otp: cerifyOTP.token,
          email: input.userdata,
        }),
      ]);
      return res.sendSuccess("OTP sent to your registered email id");
    } else {
      let promises = await bluebird.all([
        tokenService.deleteOne({
          user: userdata._id,
          // type: input.type + "-otp",
        }),
        tokenService.insert(cerifyOTP),
        sms.sendPasswordSms({
          otp: cerifyOTP.token,
          phone: "+91" + input.userdata,
        }),
      ]);
      return res.sendSuccess("OTP sent to your registered phobe");
    }
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

//Sign Up Emailotp
module.exports.signUpEmailotp = async (data) => {
  try {
    const cerifyOTP = {
      token: utils.getOtp(),
      user: data._id,
      type: "email-otp",
    };
    const promises = [tokenService.insert(cerifyOTP)];
    await promises.push(
      email.sendSignUpEmailOTP({
        otp: cerifyOTP.token,
        email: data.email,
      })
    );
    return promises, "Email";
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

//New Client Register
module.exports.newClientRegister = async (data) => {
  try {
    const promises = [];
    await promises.push(
      email.newClientRegister({
        name: data.name,
        email: data.email,
        phone: data.phone,
        uiDomainName: data.uiDomainName,
      }),
      email.newClientRegistertoAdmin({
        name: data.name,
        email: data.email,
        phone: data.phone,
        uiDomainName: data.uiDomainName,
      })
    );
    return promises, "Email";
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.signUpValidater = async (req, res, next) => {
  try {
    let bodyData = req.body;
    let validate_error = [];

    if (!bodyData.hasOwnProperty("brandName") || bodyData.brandName == "") {
      validate_error.push("Brand Name is Required");
    } else if (
      bodyData.hasOwnProperty("brandName") &&
      bodyData.brandName.toString().length < 2
    ) {
      validate_error.push("Brand Name is Invalid");
    }

    if (!bodyData.hasOwnProperty("dialCode") || bodyData.dialCode == "") {
      validate_error.push("Country Code is Required");
    }

    if (!bodyData.hasOwnProperty("phone") || bodyData.phone == "") {
      validate_error.push("Phone Number is Required");
    } else if (
      bodyData.hasOwnProperty("phone") &&
      bodyData.phone.toString().length != 10 &&
      isNaN(bodyData.phone)
    ) {
      validate_error.push("Phone Number is Invalid");
    }

    if (!bodyData.hasOwnProperty("email") || bodyData.email == "") {
      validate_error.push("Email Required");
    } else {
      var validRegex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (
        bodyData.hasOwnProperty("email") &&
        bodyData.email.match(validRegex)
      ) {
      } else {
        validate_error.push("Invalid Email");
      }
    }

    if (
      !bodyData.hasOwnProperty("password") ||
      bodyData.password == "" ||
      bodyData.repassword == ""
    ) {
      validate_error.push("Password is Required");
    } else if (
      bodyData.hasOwnProperty("password") &&
      bodyData.password.toString().length < 8 &&
      bodyData.repassword.toString().length < 8
    ) {
      validate_error.push("Invalid password length");
    } else if (bodyData.password != bodyData.repassword) {
      validate_error.push("Invalid password");
    }

    if (validate_error.length > 0) {
      res.sendBadRequest(validate_error + ",");
      return;
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.signInValidater = async (req, res, next) => {
  try {
    let bodyData = req.body;
    let validate_error = [];

    if (!bodyData.hasOwnProperty("username") || bodyData.username == "") {
      validate_error.push("User Name Required");
    }

    if (!bodyData.hasOwnProperty("password") || bodyData.password == "") {
      validate_error.push("Password is Required");
    }

    if (validate_error.length > 0) {
      res.sendBadRequest(validate_error + ",");
      return;
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.getClientProfile = async (req, res) => {
  try {
    let input = {};

    input.query = { brandId: req.user.brandId || req.query.brandId };
    input.brandQuery = { _id: req.user.brandId || req.query.brandId };
    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        // console.log("params =>", params);
        return bluebird.all([
          brandService.getOne(params.brandQuery),
          userService.getOne(params.query),
          userService.getCount(params.query),
          storeService.getCount(params.query),
          cameraService.getCount(params.query),
          groupService.getCount(params.query),
        ]);
      })
      .spread((brand, user, userCount, storeCount, cameraCount, groupCount) => {
        let basicInfo = {
          brandLogo: brand.brandLogo || '',
          brandId: brand._id || '',
          brandName: brand.brandName || '',
          name: user.name || '',
          email: user.email || '',
          accountCompletion: brand.accountCompletion || '',
          subscribe: brand.subscribe || '',
        };

        let resultData = {
          basicInfo: basicInfo,
          userCount: userCount,
          storeCount: storeCount,
          cameraCount: cameraCount,
          groupCount: groupCount,
        };

        res.sendSuccess(resultData);
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

module.exports.changePassword = async (req, res) => {
  try {
    let query = {};
    query.email = req.user.email;

    req.body.password = req.body.currentPassword;
    await crypto
      .encrypt(_.get(req.body, "password", ""))
      .then(async (password) => {
        query.password = password;
        let checkQuery = await userService.getOne(query);
        if (checkQuery) {
          if (req.body.newPassword == req.body.verifyPassword) {
            req.body.password = req.body.newPassword;
            await crypto
              .encrypt(_.get(req.body, "password", ""))
              .then(async (newpassword) => {
                let setpassword = { password: newpassword };
                let resultData = await userService.updateOne(
                  query,
                  setpassword
                );
                if (resultData) {
                  res.sendSuccess("Password Changed Successfully");
                } else {
                  res.sendServerError("Something went wrong plz try agin");
                }
              });
          } else {
            res.sendServerError("New password and Verify password not match");
          }
        } else {
          res.sendServerError("Invalid Current Password");
        }
      });
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.changePasswordValidater = async (req, res, next) => {
  let bodyData = req.body;
  let errorMsg = "";

  if (bodyData.currentPassword == "") {
    errorMsg = errorMsg + "Current Password Required, ";
  }

  if (bodyData.newPassword == "") {
    errorMsg = errorMsg + "New Password Required, ";
  } else if (
    bodyData.newPassword.toString().length < 8 &&
    isNaN(bodyData.newPassword)
  ) {
    errorMsg = errorMsg + "New Password Invalid, ";
  }

  if (bodyData.verifyPassword == "") {
    errorMsg = errorMsg + "Verify Password Required, ";
  } else if (
    bodyData.verifyPassword.toString().length < 8 &&
    isNaN(bodyData.verifyPassword)
  ) {
    errorMsg = errorMsg + "Verify Password Invalid, ";
  }

  if (bodyData.newPassword != bodyData.verifyPassword) {
    errorMsg = errorMsg + "New Password and verify password not matched, ";
  }

  if (errorMsg && errorMsg.toString().length > 0) {
    res.sendServerError(errorMsg);
  } else {
    next();
  }
};

module.exports.homepageFlages = async (req, res) => {
  try {
    let query = {
      brandId: req.user.brandId,
    };

    let storeBannerFlag = true;
    let configBannerFlag = true;

    let storeDetails = await storeService.find(query);
    // console.log("storeDetails =>", storeDetails);
    let brandDetails = await brandService.getOne({ _id: req.user.brandId });
    // console.log("brandDetails =>", brandDetails);

    if (storeDetails && storeDetails.length > 0) {
      storeBannerFlag = false;
      if (
        brandDetails &&
        brandDetails.brandConfigs &&
        brandDetails.brandConfigs.storeOpenTime &&
        brandDetails.brandConfigs.storeOpenTime != ""
      ) {
        configBannerFlag = false;
      }
    }

    if (storeBannerFlag) {
      configBannerFlag = false;
    }

    let resultData = { storeBannerFlag, configBannerFlag };
    // console.log("resultData =>", resultData);
    res.sendSuccess(resultData);
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};
module.exports.logout = (req, res) => {
  let query = {
    _id: req.user._id
  }
  userService
    .getOne(query)
    .then(async (record) => {
      if (!record) {
        res.sendUnauthorized("user not found")
        return
      }
      let updateuser = await userService.updateOne({ _id: req.user._id }, { refreshToken: "" })
      let removetoken = await tokenService.deleteOne({ token: req.token })
      res.sendSuccess(removetoken);
    }).catch((error) => {
      console.log("error =>", error);
      res.sendServerError(error);
    });



}