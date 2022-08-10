/**
 * @name api_auth_middleware_acl
 * @description API Access Control
 */

// NPM Modules
const _ = require("lodash"),
  // services
  constants = require("../../core/constants"),
  tokenService = require(".././services/tokens"),
  userService = require("../../users/services/users"),
  brandService = require("../../superadmin/services/brand"),
  storeService = require("../../stores/services/stores"),
  edgeappService = require("../../edge-app/services/edgeapp_service");
bluebird = require("bluebird");
const db = require("../../../config/database/postgres");

// User is Authentication or Not
module.exports.isAllowed = (req, res, next) => {
  const token = _.get(req.headers, "authorization", "").split(" ")[1];

  if (!token) {
    res.sendUnauthorized();
    return;
  }

  tokenService
    .getOne({ token })
    .then((record) => {
      if (!record) {
        res.sendUnauthorized();
        return;
      }
      req.user = record.user;
      req.store = record.store;
      req.token = token;
      next();
    })
    .catch((error) => {
      // console.log("step1..........................");
      res.sendServerError(error);
    });
};

module.exports.isAllowed_sessionHandler = (req, res, next) => {
  const token = _.get(req.headers, "authorization", "").split(" ")[1];
  if (!token) {
    res.sessionExpired();
    return;
  }
  
  tokenService
    .getOne({ token })
    .then(async(record) => {
      // console.log("me record =>", record);
      if (!record) {
        return res.sessionExpired();
      }
      if(record.user.role == "storesuperadmin" || record.user.role == "storeadmin" || record.user.role == "storeuser"){
        if(record.user.first_user == 0){
          let userUpdate = await brandService.updateOne(
            {_id:record.user.brandId},{ first_user: 1 }
          );
          // console.log("ME userUpdate************************",userUpdate)
        } 
      }           
      req.user = record.user;
      req.store = record.store;
      req.token = token;
      next();
    })
    .catch((error) => {
      console.log("me error..........................", error);
      return res.sendServerError(error);
    });
};

module.exports.isStoreAdmin = (req, res, next) => {
  const _id = req.user;
  userService
    .getOne({ _id })
    .then((record) => {
      if (!record || record.role != constants.role.storeAdmin) {
        res.sendUnauthorized();
        return;
      }
      req.brandId = record.brandId;
      next();
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

module.exports.isAuthorized = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole == constants.role.user) {
    let testUserPermission = false;
    _.filter(constants.UserPermission, function (data) {
      if (
        data.rolesAssigned.includes(userRole) &&
        data.reqMethod.includes(req.method) &&
        data.reqFullPath == req.route.path
      ) {
        testUserPermission = true;
      }
    });
    if (!testUserPermission) {
      res.sendUnauthorized();
      return;
    }
    next();
  } else {
    next();
  }
};

module.exports.isSuperAdmin = (req, res, next) => {
  const _id = req.user;
  userService
    .getOne({ _id })
    .then((record) => {
      if (
        !record ||
        (record.role != constants.role.storesuperadmin &&
          record.role != constants.role.superadmin &&
          record.role != constants.role.admin &&
          record.role != constants.role.user)
      ) {
        res.sendUnauthorized();
        return;
      }
      next();
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

module.exports.validate = async (req, res, next) => {
  try {
    const input = req.body;
    const validate_error = [];
    return bluebird
      .all([
        this.validate_brand(input),
        this.validate_email(input),
        this.validate_phone(input),
      ])
      .spread((brand, email, phone) => {
        if (brand != "") {
          validate_error.push("Brand Name");
        }
        if (email != "") {
          validate_error.push("Email Id");
        }
        if (phone != "") {
          validate_error.push("Phone Number");
        }
      })
      .then(() => {
        if (validate_error.length > 0) {
          res.sendBadRequest(validate_error + " Already Exist");
          return;
        }
        next();
      });
  } catch (error) {
    res.sendServerError(error);
    return;
  }
};

module.exports.validatepostgres = async (req, res, next) => {
  try {
    let [data, data1] = await Promise.all([ db.query(`SELECT * FROM edgeapp.client 
    WHERE  
    client_id=${req.body.clientId}`),  db.query(`SELECT * FROM edgeapp.client 
    WHERE 
    name = '${req.body.name}'`)]);

    if (data.rowCount >= 1) {
      return res.sendUnauthorized("ClientId Already Exists");
    }
    if(data1.rowCount >= 1){
      return res.sendUnauthorized("Client Name Already Exists")
    }
    next();
  } catch (error) {
    console.error(error);
    return res.sendServerError(error);
  }
};

module.exports.validate_sdk_and_store = async (req, res, next) => {
  try {
    let storeData = await db.query(
      `SELECT * FROM edgeapp.store where store_id = '${req.body.store_id}'`
    );
    let sdkData = await db.query(
      `SELECT * FROM edgeapp.sdk_auth WHERE app_id = '${req.body.app_id}'`
    );
    if (storeData.rowCount == 0 && sdkData.rowCount == 0) {
      next();
    }else{
      return res.sendUnauthorized("Store Already Exists");
  }
  } catch (error) {
    console.error(error);
    return res.sendServerError(error);
  }
};

module.exports.validate_brand = async (input) => {
  try {
    let query = {
      brandName: input.brandName,
    };
    let validate_b = await brandService.getOne(query);
    if (validate_b) {
      return "Brand";
    }
    return "";
  } catch (error) {
    return error;
  }
};

module.exports.validate_email = async (input) => {
  try {
    let query = {
      email: input.email,
    };
    let validate_e = await Promise.all([
      brandService.getOne(query),
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
      brandService.getOne(query),
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

module.exports.edgeAppIsAllowed = async (req, res, next) => {
  try {
    const token = _.get(req.headers, "authorization", "").split(" ")[1];
    if (!token) {
      res.sendUnauthorized();
      return;
    }
    let data = await db.query(
      `select * from edgeapp.sdk_auth where store_id=$1 and access_token=$2`,
      [req.body.store_id, token]
    );
    if (data.rowCount == 0) {
      return res.edgeappError();
    }
    next();
  } catch (error) {
    console.error(error);
    return error;
  }
};

// token is Authentication or Not
module.exports.CheckEdgeAppToken = (req, res, next) => {
  const token = _.get(req.headers, "authorization", "").split(" ")[1];

  if (!token) {
    res.sendUnauthorized();
    return;
  }

  tokenService
    .getOne({ token })
    .then((record) => {
      if (!record) {
        res.sendUnauthorized();
        return;
      }
      req.user = record.user;
      req.store = record.store;
      req.token = token;
      next();
    })
    .catch((error) => {
      // console.log("step1..........................");
      res.sendServerError(error);
    });
};

module.exports.isAllowed_edgeApp = (req, res, next) => {
  const edgeAppToken = _.get(req.headers, "edgeapp-authorization", "").split(" ")[1];
  if (!edgeAppToken) {
    res.sendUnauthorized();
    return;
  }

  edgeappService
    .edgeappGetOne({ edgeAppToken })
    .then((record) => {
      if (!record) {
        res.sendUnauthorized();
        return;
      }
      req.data = record;
      req.token = edgeAppToken;
      next();
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};

module.exports.isAdminUsers = (req, res, next) => {
  const _id = req.user;
  userService
    .getOne({ _id })
    .then((record) => {
      if (
        !record ||
        (record.role != constants.role.superadmin &&
          record.role != constants.role.admin &&
          record.role != constants.role.user)
      ) {
        res.sendUnauthorized();
        return;
      }
      next();
    })
    .catch((error) => {
      res.sendServerError(error);
    });
};