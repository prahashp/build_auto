/**
 * @name api_stores_controllers_store
 * @description Store Controller
 */

// services
const storeService = require(".././services/stores"),
  // modules
  stores = require(".././modules/stores");
const brandService = require("../../superadmin/services/brand");
const email = require("../../core/modules/email/index");
const bluebird = require("bluebird"),
  _ = require("lodash"),
  timezones = require("../../core/services/timezones");
const groupService = require("../../groups/services/groups");
const camerService = require("../../camera/services/camera");
const alertsServices = require("../../alerts/services/alerts");
const db = require("../../../config/database/postgres");
const env = require("../../../config/env/index");
const ObjectId = require("mongodb").ObjectId;

module.exports.new = async (req, res) => {
  const input = req.body;
  input.admin = req.user._id;
  let query = {};
  let getStoreCount = {};
  if (
    (req.user.role && req.user.role == "superadmin") ||
    req.user.role == "admin" ||
    (req.user.role == "user" && input.brandId)
  ) {
    query._id = input.brandId;
    getStoreCount.brandId = input.brandId;
    input.brandId = input.brandId;
  } else {
    query._id = req.user.brandId;
    getStoreCount.brandId = req.user.brandId || input.brandId;
    input.brandId = req.user.brandId || input.brandId;
  }
  await storeService
    .getCount(getStoreCount)
    .then(async (storesCount) => {
      let brandDetails = await brandService.getOne(query);

      const storeId = storesCount + 100;
      const clientId = brandDetails.brandIndex;
      input.client_id = brandDetails.brandIndex;
      input.id = `${clientId}-${storeId}`;
      input.appId = await stores.getApplicationId(
        brandDetails.brandName,
        storeId,
        clientId
      );      
      return storeService.insert(input);
    })
    .then(async (record) => {
      //// Start: Postgress Update////
      let pg_data = await this.storeInsertPostgres(record);
      record.spoc.appId = record.appId;
      if (req.body.cameras && req.body.cameras.length) {
        let cameraData = await updateStoreIdInCameraObj(
          record,
          req.body.cameras
        );
        let camera = await camerService.insertMany(cameraData);
      }
      //// End: Postgress Update////
      await email.sendNewStoreConfig(record.spoc);
      await email.sendNewStoreConfigToAdmin(record.spoc);

      let location = "";
      if (input.location) {
        location = " located at " + input.location || "";
      }

      let alertInsertData = {
        name: "Store Added",
        description:
          input.name +
          location +
          " has been succsesfully onboarded to the platform",
        category: "Add Store",
        clientNotification: true,
        adminNotification: true,
        brandId: req.user.brandId,
        user: req.user._id,
      };
      alertsServices.insert(alertInsertData);

      res.sendSuccess(record);
    })
    .catch((error) => {
      console.error(error);
      res.sendServerError(error);
    });
};

function updateStoreIdInCameraObj(storeData, cameraData) {
  for (let i = 0; i < cameraData.length; i++) {
    cameraData[i].store = storeData._id;
    cameraData[i].brandId = storeData.brandId;
    cameraData[i].RTSP = cameraData[i].RtspUrl;
    cameraData[i].isUp = cameraData[i].IsUp;
    cameraData[i].no = cameraData[i].CameraNumber;
    cameraData[i].isActivated = false;
    cameraData[i].thumbnailImage = null;
    cameraData[i].retentionPeriod = 0;
  }
  return cameraData;
}

module.exports.storeInsertPostgres = async (data) => {
  try {
    let input = data;
    let client_id = _.split(input.id, "-", 2);
    let store_insert = `INSERT INTO edgeapp.store(name,location, client_id, client__id, store_id, store_incharge, email, phone_number, time_zone,status) VALUES ($1, $2, $3, $4, $5, $6 ,$7, $8, $9,$10) RETURNING *`;
    let storeQuery = await db.query(store_insert, [
      input.name,
      input.location,
      client_id[0],
      client_id[0],
      input.id,
      input.spoc.name,
      input.spoc.email,
      input.spoc.contact,
      input.timezone,
      1,
    ]);
    let idFromAddingStore = storeQuery.rows[0].id;
    let sdk_insert = `INSERT INTO edgeapp.sdk_auth(store_id, app_id, store__id,is_active) VALUES ($1, $2, $3,$4)`;
    let sdkQuery = await db.query(sdk_insert, [
      input.id,
      input.appId,
      idFromAddingStore,
      1,
    ]);
    if (storeQuery.rowCount == 1 && sdkQuery.rowCount == 1) {
      return "Store Inserted SuccessFully";
    }
  } catch (error) {
    console.error(error);
    return error.detail;
  }
};

module.exports.list_old = async (req, res) => {
  try {
    // console.log("req.brand=>", req.brandId);
    let query = {
      brandId: req.brandId,
    };
    let record = {};
    if (req.query.param == "teaser") {
      record = {
        name: 1,
        location: 1,
        appId: 1,
        id: 1,
        _id: 1,
        spoc: 1,
        edgeAppToken: 1,
      };
    }
    let stores = await storeService.getMany(query, record);
    res.sendSuccess(stores);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.list = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }
    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }

    if (req.query.storeId) {
      input.query.id = req.query.storeId;
    }
    if (req.query.name) {
      input.query.name = req.query.name;
    }
    if (req.query.appId) {
      input.query.appId = req.query.appId;
    }
    if (req.query.paired) {
      input.query.paired = req.query.paired;
    }
    if (req.query.configured) {
      input.query.configured = req.query.configured;
    }
    if (req.query.active) {
      input.query.active = req.query.active;
    }
    if (req.query.id) {      
      input.query.id = req.query.id;
      // input.query.id = JSON.parse("[" + req.query.id + "]");
    }
    if (req.query.spocName) {
      // input.query.spoc = {};
      input.query["spoc.name"] = req.query.spocName;
    }

    input.limit = req.query.limit || 10;
    input.skip = req.query.limit * req.query.offset || 0;
    if (req.query.param == "teaser") {
      input.record = {
        name: 1,
        location: 1,
        appId: 1,
        id: 1,
        _id: 1,
        spoc: 1,
        edgeAppToken: 1,
      };
    }

    if (req.user.role == "storeuser") {
      if (req.user.storeType === "single") {
        input.query._id = req.user.stores[0];
      } else {
        let groupQuery = {
          _id: { $in: req.user.groups },
        };
        let storeDatFromGroup = await groupService.getMany(groupQuery);
        let storeId = [];
        for (let i = 0; i < storeDatFromGroup.length; i++) {
          for (let j = 0; j < storeDatFromGroup[i].stores.length; j++) {
            storeId.push(storeDatFromGroup[i].stores[j]);
          }
        }
        if (storeId.length > 0) {
          input.query._id = { $in: storeId };
        }
      }
    }

    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        // console.log("params =>", params);
        return bluebird.all([
          storeService.findLimit(
            params.query,
            params.record,
            params.skip,
            params.limit
          ),
          storeService.getCount(params.query),
        ]);
      })
      .spread((data, count) => {
        res.status(200).json({ count, data });
      })
      .catch((error) => {
        console.error(error);
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

    let store = await storeService.getOne({ _id });
    if (!store) {
      res.sendBadRequest("Stores doesnot exists.");
      return;
    }

    res.sendSuccess(store);
  } catch (error) {
    console.log("error =>", error);
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

    // console.log("cameras 1=>",input.cameras);
    // input.cameras.forEach((element,index) => {
    //   console.log("element =>", element);
    //   if(element.ip ==''){
    //     console.log("check if delete", index);
    //     input.cameras[index].delete;
    //   }else{
    //     console.log("check else", index);
    //   }
    // });
    // // input.cameras = input.cameras1;
    // console.log("cameras 2=>",input.cameras);

    input.updatedAt = new Date();
    let resultData = await storeService.updateOne(query, input);
    ////Send Email for store active and deactive////
    let getStoreData = await storeService.find(query);
    if (getStoreData) {
      let emailData = {
        email: getStoreData[0].spoc.email,
        storeName: getStoreData[0].name,
      };
      if (input.active && input.active == true) {
        await email.sendActivetoClient(emailData);
      } else if (input.active == false) {
        await email.sendDeactivetoClient(emailData);
      } else {
      }
    }

    if (input.active == false) {
      let alertInsertData = {
        name: "Store Deactive",
        description:
          store.name +
          ' has been deactived, if you still want to active them back please click on the link for activation <a href="' +
          env.uiDomainName +
          'store/list" > ' +
          env.uiDomainName +
          "store/list</a>",
        category: "Deactive Store",
        clientNotification: true,
        adminNotification: true,
        brandId: req.user.brandId || getStoreData[0].brandId,
        user: req.user._id,
      };
      alertsServices.insert(alertInsertData);
    }

    if (input && input.active != false) {
      let alertInsertData = {
        name: "Store Updated",
        description: store.name + " has been successfully updated",
        category: "Update Store",
        clientNotification: true,
        brandId: req.user.brandId || getStoreData[0].brandId,
        user: req.user._id,
      };
      alertsServices.insert(alertInsertData);
    }

    res.sendSuccess("Success! Store updated successfully.");
  } catch (error) {
    console.log("error =>", error);
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

module.exports.sendMail = async (req, res) => {
  try {
    const promises = [];
    let pairemaildata = { email: req.body.spoc.email, appId: req.body.appId };

    promises.push(email.sendStorePairedDetails(pairemaildata));
    return bluebird
      .all(promises)
      .then(() => {
        res.sendSuccess("The camera ips has been updated!");
      })
      .catch((error) => {
        res.sendServerError(error);
      });
  } catch (error) {
    // console.log("error=>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.exporlist = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }
    if(req.user.brandId){
      input.query.brandId = req.user.brandId;
    }

    if (req.query.storeId) {
      input.query.id = req.query.storeId;
    }
    if (req.query.appId) {
      input.query.appId = req.query.appId;
    }
    if (req.query.paired) {
      input.query.paired = req.query.paired;
    }
    if (req.query.configured) {
      input.query.configured = req.query.configured;
    }
    if (req.query.spocName) {
      input.query.spoc = {};
      input.query.spoc.name = req.query.spocName;
    }

    // input.limit = req.query.limit || 10;
    // input.skip = req.query.limit*req.query.offset || 0;
    if (req.query.param == "teaser") {
      input.record = {
        name: 1,
        location: 1,
        appId: 1,
        id: 1,
        _id: 1,
        spoc: 1,
        edgeAppToken: 1,
      };
    }

    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        // console.log("params =>", params);
        return bluebird.all([
          storeService.find(
            params.query,
            params.record,
            params.skip,
            params.limit
          ),
          storeService.getCount(params.query),
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
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.bulkStore = async (req, res) => {
  let storeDuplicate = [];
  let result = {};
  var error_msg = ""
  if (req.body.filtereduserphonestores.length > 0) {
    error_msg = req.body.phone_error_msg;
    req.body = req.body.filtereduserphonestores
    console.log("===================", req.body);
    // return
    for (let i = 0; i < req.body.length; i++) {
      let query = {
        brandId: req.body[i].brandId ? req.body[i].brandId : req.user.brandId,
        name: req.body[i].name,
      };
      let store = await storeService.getOne(query);
      if (store) {
        storeDuplicate.push(store.name);
      } else {
        const input = req.body[i];
        input.admin = req.user._id;
        await storeService
          .getCount({
            brandId: req.body[i].brandId ? req.body[i].brandId : req.user.brandId,
          })
          .then(async (storesCount) => {
            let query = {
              _id: req.body[i].brandId ? req.body[i].brandId : req.user.brandId,
            };
            let brandDetails = await brandService.getOne(query);
            const storeId = storesCount + 1;
            const clientId = brandDetails.brandIndex;
            input.client_id = brandDetails.brandIndex;
            input.id = `${clientId}-${storeId}`;
            input.appId = await stores.getApplicationId(
              brandDetails.brandName,
              storeId,
              clientId
            );
            input.brandId = req.body[i].brandId
              ? req.body[i].brandId
              : req.user.brandId;
            console.log("input", input);
            return storeService.insert(input);
          })
          .then(async (record) => {
            let pg_data = await this.storeInsertPostgres(record);
            console.log(pg_data);
            record.spoc.appId = record.appId;
            if (req.body[i].cameras && req.body[i].cameras.length) {
              let cameraData = await updateStoreIdInCameraObj(
                record,
                req.body[i].cameras
              );
              let camera = await camerService.insertMany(cameraData);
            }
            await email.sendNewStoreConfig(record.spoc);
            await email.sendNewStoreConfigToAdmin(record.spoc);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    if (storeDuplicate.length > 0) {
      result.data = 'Success'
      result.message = error_msg
      res.sendSuccess(result)
    } else {
      result.data = 'Success'
      result.message = error_msg
      res.sendSuccess(result)
    }
  } else {
    result.data = 'Success'
    result.message = error_msg
    res.sendSuccess(result)
  }
};

module.exports.bulkuploadstorenamevalidator = async (req, res, next) => {

  const bodyData = req.body;
  let returndata = []
  let invaildstorename = []
  let response = ""
  for (var i = 0; i < bodyData.length; i++) {
    if (!bodyData[i].hasOwnProperty("name") || bodyData[i].email == "") {

    } else {
      if (bodyData[i].hasOwnProperty("name")) {
        let query = { name: bodyData[i].name }
        let store = await storeService.getOne(query);
        if (store == null) {
          returndata.push(bodyData[i])
        } else {
          invaildstorename.push(bodyData[i].name)
        }

      }
    }

    if (i == bodyData.length - 1) {
      if (invaildstorename.toString().length > 0) {
        response = response + String(invaildstorename) + " Invalid stores name";
      }
      req.body.validatedstores = returndata
      req.body.storename_msg = response
      next();
    }


  }

}
module.exports.bulkuploadstoretypevalidator = async (req, res, next) => {

  const bodyData = req.body.validatedstores;
  let returndata = []
  let invaliodstoretype = []
  var response = ""
  var result = {}
  if (bodyData.length > 0) {
    for (var i = 0; i < bodyData.length; i++) {

      if (!bodyData[i].hasOwnProperty("storeType") || bodyData[i].storeType == "") {

      } else {
        if (bodyData[i].hasOwnProperty("storeType")
          && bodyData[i].storeType == "coco") {
          returndata.push(bodyData[i])
        } else if (bodyData[i].hasOwnProperty("storeType")
          && bodyData[i].storeType == "cofo") {
          returndata.push(bodyData[i])
        } else if (bodyData[i].hasOwnProperty("storeType")
          && bodyData[i].storeType == "foco") {
          returndata.push(bodyData[i])
        } else if (bodyData[i].hasOwnProperty("storeType")
          && bodyData[i].storeType == "fofo") {
          returndata.push(bodyData[i])
        }
        else {
          invaliodstoretype.push(bodyData[i].storeType)

        }
      }
      if (i == bodyData.length - 1) {
        if (String(invaliodstoretype).length > 0) {
          response = response + " & " + String(invaliodstoretype) + "  is invalid storetype"
        }
      }
    }
    req.body.filteredstores = returndata
    req.body.storetype_error_msg = req.body.storename_msg + response
    next();
  } else {
    result.data = 'Success'
    result.message = req.body.storename_msg
    res.sendSuccess(result)

  }

}

module.exports.bulkuploadstoreuseremailvalidator = async (req, res, next) => {
  const bodyData = req.body.filteredstores;
  let returndata = []
  let invalioduseremail = []
  var response = ""
  var result = {}
  if (bodyData.length > 0) {


    for (var i = 0; i < bodyData.length; i++) {

      if (bodyData[i].spoc && bodyData[i].spoc.email == "") {

      } else {
        var validRegex =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (bodyData[i].spoc && bodyData[i].spoc.email.match(validRegex)) {
          returndata.push(bodyData[i])
        } else {
          invalioduseremail.push(bodyData[i].spoc.email)
        }
      }
      if (i == bodyData.length - 1) {
        if (String(invalioduseremail).length > 0) {
          response = response + " & " + String(invalioduseremail) + "  is invalid user email"
        }
      }
    }
    req.body.filtereduseremailstores = returndata
    req.body.useremail_msg = req.body.storetype_error_msg + response
    next();
  } else {
    result.data = 'Success'
    result.message = req.body.storename_msg
    res.sendSuccess(result)

  }
}
module.exports.bulkuploadstoreuserphonevalidator = async (req, res, next) => {

  const bodyData = req.body.filtereduseremailstores;
  let returndata = []
  let invalioduserphone = []
  var response = ""
  var result = {}
  if (bodyData.length > 0) {

    for (var i = 0; i < bodyData.length; i++) {

      if (bodyData[i].spoc && bodyData[i].spoc.contact == "") {

      } else {
        if (bodyData[i].spoc && String(bodyData[i].spoc.contact).length == 10) {
          returndata.push(bodyData[i])
        } else {
          invalioduserphone.push(bodyData[i].spoc.contact)
        }
      }
      if (i == bodyData.length - 1) {
        if (String(invalioduserphone).length > 0) {
          response = response + " & " + String(invalioduserphone) + "  is invalid user phone"
        }
      }
    }
    req.body.filtereduserphonestores = returndata
    req.body.phone_error_msg = req.body.useremail_msg + response
    next();
  } else {
    result.data = 'Success'
    result.message = req.body.storename_msg
    res.sendSuccess(result)

  }
}



module.exports.bulkStoreWithStoreId = async (req, res) => {
  let query = {
    _id: req.user.brandId,
  };
  let brandDetails = await brandService.getOne(query);
  for (let i = 0; i < req.body.length; i++) {
    const input = req.body[i];
    const clientId = brandDetails.brandIndex;
    input.client_id = brandDetails.brandIndex;
    input.appId = await stores.getApplicationId(
      brandDetails.brandName,
      input.id,
      clientId
    );
    input.brandId = req.user.brandId;
    await storeService.insert(input);
  }
  res.sendSuccess("store uploaded");
};

module.exports.storeList = async (req, res) => {
  try {
    let query = {};
    // console.log("req.use =>", req.use);
    if(req.user.brandId){
      query.brandId = req.user.brandId;
    }

    if(req.query.brandId){
      query.brandId = req.query.brandId;
    }

    query.active = true;

    let record = {
      id: 1,
      name: 1,
      updatedAt: 1,
    };

    let result = await storeService.getMany(query, record);
    res.sendSuccess(result);
  } catch (error) {
    console.error("error storeList =>", error);
    res.sendServerError(error);
  }
};

module.exports.search = async (req, res) => {
  try {
    const _id = req.body.key;
    let query = {
      brandId: req.body.brandId ? req.body.brandId : req.user.brandId,
      name: { $regex: req.body.key, $options: 'i'},      
    };
    let user = await storeService.getSearchResult(query);
    if (!user) {
      res.sendBadRequest("Stores doesnot exists.");
      return;
    }

    res.sendSuccess(user);
  } catch (error) {
    console.log("error store search=>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.storeAddValidater = async (req, res, next) => {
  let bodyData = req.body;
  let errorMsg = "";

  if (bodyData.name == "") {
    errorMsg = errorMsg + "Store Name Required, ";
  }

  if (bodyData.storeType == "") {
    errorMsg = errorMsg + " Store Type Required, ";
  }

  if (bodyData.timezone == "") {
    errorMsg = errorMsg + " Time Zone Required, ";
  }

  if (bodyData.location == "") {
    errorMsg = errorMsg + " location Required, ";
  }

  if (bodyData.spoc.contact.toString().length != 10) {
    errorMsg = errorMsg + " Spoc Contact Invalid, ";
  }

  if (isNaN(bodyData.spoc.contact)) {
    errorMsg = errorMsg + " Spoc Contact Invalid, ";
  }

  if (bodyData.spoc.email == "") {
    errorMsg = errorMsg + " Spoc Email Required, ";
  }

  if (bodyData.spoc.name == "") {
    errorMsg = errorMsg + " Spoc Name Required, ";
  }

  if (errorMsg && errorMsg.toString().length > 0) {
    res.sendServerError(errorMsg);
  } else {
    next();
  }
};

module.exports.sdk_and_store = async (req, res, next) => {
  let data = req.body;
  let error = "";

  if (data.name === "") {
    error = error + "Store Name Required, ";
  }
  if (data.client_id === "") {
    error = error + "Client Id Required, ";
  }
  if (data.store_id === "") {
    error = error + "Store Id Required, ";
  }
  if (data.time_zone === "") {
    error = error + "Time Zone Required, ";
  }
  if (data.app_id === "") {
    error = error + "App Id Required, ";
  }
  if (error && error.toString().length > 0) {
    res.sendServerError(error);
  } else {
    next();
  }
};

module.exports.findStoreViaBrand = async (req, res) => {
  try {
    let query = {
      brandId: req.user.brandId,
    };
    let store = await storeService.getMany(query);
    if (!store) {
      res.sendBadRequest("Stores doesnot exists.");
      return;
    }

    res.sendSuccess(store);
  } catch (error) {
    console.error("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.summaryStoreList = async (req, res) => {
  try {
    var inputData = req.body;
    // console.log("InputData",inputData.groupId.length,inputData.city.length)

    let query = {};
    query.brandId = req.user.brandId;
    query.active = true;

    let record = {
      id: 1,
      name: 1,
    };

    let findStores = [];
    ///Check City/////
    // if(inputData.hasOwnProperty("city") && inputData.city!='' && inputData.city.length>0){
    //   let getStoresFromcity = await storeService.find({city:{$in: inputData.city}},{_id:1});
    //   console.log("getStoresFgetStoresFromcityromGroup =>", getStoresFromcity);
    //   getStoresFromcity.forEach(element => {
    //     !(element._id in findStores)
    //     findStores.push(element._id);
    //   });
    // }
    if (
      inputData.hasOwnProperty("city") &&
      inputData.city != "" &&
      inputData.city.length > 0
    ) {
      query.city = { $in: inputData.city };
    }

    ////Check Group/////
    if (
      inputData.hasOwnProperty("groupId") &&
      inputData.groupId != "" &&
      inputData.groupId.length > 0
    ) {
      let getStoresFromGroup = await groupService.find(
        { _id: { $in: inputData.groupId } },
        { stores: 1 }
      );
      getStoresFromGroup.forEach((element1) => {
        element1.stores.forEach((element) => {
          !(element in findStores);
          // !(findStores.includes(element) )
          findStores.push(element);
        });
      });
    }

    if (findStores && findStores.length > 0) {
      query._id = { $in: findStores };
      let result = await storeService.find(query, record);
      res.sendSuccess(result);
    } else {
      let result = await storeService.find(query, record);
      res.sendSuccess(result);
    }
  } catch (error) {
    console.error("error =>", error);
    res.sendServerError(error);
  }
};

module.exports.getStoreLocationforToolbar = async (req, res) => {
  try {
    let query = {};
    query.brandId = req.user.brandId;
    query.active = true;
    query.city = { $exists: true };

    let record = {
      id: 1,
      name: 1,
      city: 1,
    };
    let store = await storeService.getMany(query, record);
    if (!store) {
      res.sendNoContent("Stores doesnot exists.");
      return;
    }
    res.sendSuccess(store);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.getGroupsByLocationforToolbar = async (req, res) => {
  try {
    const city = req.body.city;
    let query = {};
    query.city = city;
    query.active = true;
    let record = {};
    // record.name = 1
    record.id = 1;
    // record.city = 1

    let store = await storeService.getMany(query, record);
    let id = [];
    store.forEach((element) => {
      id.push(element._id);
    });
    let groupQuery = {};
    let groupRecord = {};
    groupQuery.stores = { $in: id };
    groupRecord.groupName = 1;
    let group = await groupService.getMany(groupQuery, groupRecord);
    let result = {};
    result.count = group.length;
    result.result = group;
    res.sendSuccess(result);
  } catch (error) {
    console.error("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.storelimit = async (req, res, next) => {
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
      if (req.body.length <= brandConfigs.uploadLimit.store) {
        next();
      } else {
        return res.sendBadRequest(
          `Store count has exceeded limit...! maximum count ${brandConfigs.uploadLimit.store}`
        );
      }
    }
  } catch (error) {
    console.error(error);
    return res.sendServerError(error);
  }
};
