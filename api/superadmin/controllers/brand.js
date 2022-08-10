/**
 * @name api_stores_controllers_store
 * @description Users Controller
 */

// services
const brandService = require("../services/brand");
const userService = require('../../users/services/users'),
      storeService = require('../../stores/services/stores'),
      cameraService = require('../../camera/services/camera');
const bluebird = require("bluebird"),
  _ = require('lodash');
const crypto = require("../.././core/modules/crypto");
const tokenService = require("../../auth/services/tokens");
const email = require('../../core/modules/email');
const { listenerCount } = require("../models/brand");
const ObjectId = require("mongodb").ObjectId;

const db = require("../../../config/database/postgres");
const { signUpSyncing } = require("../../auth/controllers/auth");

module.exports.create = async (req, res) => {
  const input = req.body;
  try {
    let count = await Promise.all([
      userService.getCount(),
      brandService.getCount(),
    ]);
    let query = {
      brandName: input.brandName,
    };
    let brand = await brandService.getCount(query);
    if (brand) {
      res.sendBadRequest("Brand already exists.");
      return;
    }
    let brand_insert = await this.brand(input, count);
    let users = await userService.insert(brand_insert);
    let userIdUpdate = await brandService.updateOne({ _id: brand_insert.brandId }, { userId: users._id })
    if (userIdUpdate.acknowledged == true) {
      let pg_sync = await signUpSyncing(brand_insert);
    }
    let otp = bluebird.all([this.signUpEmailotp(users)]);
    return res.sendSuccess(
      "Success! Please verify your email activate your account."
    );
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
    return
  }
};

//brand insert
module.exports.brand = async (data, count) => {
  try {
    const brandInput = {};
    let password = await crypto.encrypt(_.get(data, "email", ""));
    data.brandIndex = count[1] + 100;
    let newBrandId = await brandService.insert(data);
    data.brandId = newBrandId._id;
    data.password = password;
    data.clientIndex = count[1] + 100;
    return data;
  } catch (error) {
    return error;
  }
};

// /Sign Up Emailotp
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
    res.sendServerError(error);
  }
};

module.exports.update = async (req, res) => {
  try {
    const input = req.body;

    let query = {
      _id: req.params.id,
    };
    let user = await brandService.getOne(query);
    if (!user) {
      res.sendBadRequest("Brand doesnot exists. Provide valid input.");
      return;
    }

    // console.log("query =>", query);
    // console.log("input =>", input);
    await brandService.updateOne(query, input);
    res.sendSuccess("Success! Brand updated successfully.");
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
    let queryBrand = {
      brandId: req.params.id,
    };

    let user = await brandService.getOne(query);
    if (!user) {
      res.sendBadRequest("Brand doesnot exists. Provide valid input.");
      return;
    }

    await brandService.updateOne(query, { active: false });
    await userService.updateOne(queryBrand, { active: false });
    await storeService.updateOne(queryBrand, { active: false });
    res.sendSuccess("Success! Brand deleted successfully.");
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.list_old = async (req, res) => {
  try {
    let query = {};

    let user = await brandService.getMany(query);
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
    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }

    if (req.query.brandId) {
      input.query._id = req.query.brandId;
    }

    input.record ={};
    if(req.query.limit){
      input.limit = req.query.limit || 10;
    }

    if(req.query.offset){
      input.skip = req.query.limit * req.query.offset || 0;
    }

    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        // console.log("params =>", params);
        return bluebird.all([
          brandService.findLimit(
            params.query,
            params.record,
            params.skip,
            params.limit
          ),
          brandService.getCount(params.query),
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

    let user = await brandService.getOne({ _id });
    if (!user) {
      res.sendBadRequest("brand doesnot exists. Provide valid input.");
      return;
    }

    res.sendSuccess(user);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.getBrandConfig = async (req, res) => {
  try {
    const _id = req.params.id;
    let brand = await brandService.getOne({ _id });
    if (!brand) {
      res.sendBadRequest("brand doesnot exists.");
      return;
    }
    res.sendSuccess(brand.brandConfigs);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.updateBrandConfig = async (req, res) => {
  try {
    const input = req.body;
    let brandConfig = {};
    brandConfig.storeOpenTime = _.get(input, 'storeOpenTime', null);
    brandConfig.storeCloseTime = _.get(input, 'storeCloseTime', null);
    brandConfig.infraAlert = {};
    brandConfig.infraAlert.condition = _.get(input, 'infraAlert.condition', null);
    brandConfig.infraAlert.value = _.get(input, 'infraAlert.value', null);
    brandConfig.bouncedConfigTime = _.get(input, 'bouncedConfigTime', null);
    brandConfig.missedOpportunityStartTime = _.get(input, 'missedOpportunityStartTime', null);
    brandConfig.missedOpportunityEndTime = _.get(input, 'missedOpportunityEndTime', null);
    brandConfig.conversionConfigTime = _.get(input, 'conversionConfigTime', null);
    brandConfig.missedOpportunityCalculate = _.get(input, 'missedOpportunityCalculate', null);
    brandConfig.billableCalculate = _.get(input, 'billableCalculate', null);
    brandConfig.conversionCalculate = _.get(input, 'conversionCalculate', null);
    brandConfig.notifications = {};
    brandConfig.notifications.email = _.get(input, 'notifications.email', false);
    brandConfig.notifications.application = _.get(input, 'notifications.application', false);
    
    let query = {_id:req.params.id};
    let updateData = {brandConfigs:brandConfig};
    let resultData = await brandService.updateOne(query,updateData);
    if(resultData){
      return res.sendSuccess("Brand Configuration Updated Successfully");
    }else{
      return res.sendBadRequest("Something Went Wrong please try agian")
    }
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.getBrandProfile = async (req, res) => {
  try {
    const _id = req.params.id;
    let brand = await brandService.getOne({ _id });
    if (!brand) {
      res.sendBadRequest("brand doesnot exists.");
      return;
    }

    let resultData = {};
    resultData.brandLogo = brand.brandLogo;
    resultData.registeredCompanyName = brand.registeredCompanyName;
    resultData.brandName = brand.brandName;
    resultData.email = brand.email;
    resultData.CINNumber = brand.CINNumber;
    resultData.industry = brand.industry;
    resultData.phone = brand.phone;
    resultData.headQuarters = brand.headQuarters;
    resultData.registeredAddress = brand.registeredAddress;

    res.sendSuccess(resultData);
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.updateBrandProfile = async (req, res) => {
  try {
    const input = req.body;    
    let query = {_id:req.params.id};
    let updateData = input;
    let resultData = await brandService.updateOne(query,updateData);
    if(resultData){
      return res.sendSuccess("Brand Profile Updated Successfully");
    }else{
      return res.sendBadRequest("Something Went Wrong please try agian")
    }
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.multiInsert = async (req, res) => {
  const input = req.body;
  try {
    let invalidbrands = [];
    input.forEach(async(element,index) => {
      // let count = await brandService.getCount({});
      // let brand = await brandService.getCount({brandName: element.brandName});
      // if (brand) {
      //   invalidbrands.push(element.brandName);
      // }else{   
      //  =================================== //  
      
        element.brandIndex = element.client_id;
        element.active = true;
        element.approved = true;
        let clientID = element.client_id;
        // delete element.client_id;
        console.log("element =>", element);
        
        let insertBrand = await brandService.insert(element);
        // console.log("insertBrand =>", insertBrand);

        let updateStore = await storeService.update({client_id:clientID},{brandId:insertBrand._id});
        // console.log("updateStore =>", updateStore);

        let updateCamera = await cameraService.update({client_id:clientID},{brandId:insertBrand._id});
        // console.log("updateCamera =>", updateCamera);

        let updateUser = await userService.update({client_id:clientID},{brandId:insertBrand._id});
        // console.log("updateUser =>", updateUser);

        let checkusers = await userService.findOne({email:element.email});
        // console.log("checkusers =>", checkusers);
        if(!checkusers){
          element.client_id = clientID;
          let insertUser = await userService.insert(element);
          // console.log("insertUser =>", insertUser);
          if(insertUser){
            let updatedBrand = await brandService.updateOne({_id:insertBrand._id},{userId:insertUser._id});
          }
        }else{
          let updatedBrand = await brandService.updateOne({_id:insertBrand._id},{userId:checkusers._id});
        }
        console.log("updated success client_id:", clientID+'-brandId:'+insertBrand._id+' || ');

      // ================================= //
      // }      
    });
    res.sendSuccess("Brand Added Successfully");
    
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
    return
  }
};

module.exports.multiInsert_getClientJSON = async (req, res) => {
  try{
    let query = `select cl.client_id,cl."name" as brandName,cl.created_at,cl.updated_at,us.email,us.phone_number as phone, concat(us.first_name,'',us.last_name) as name,'+91' as dialCode,
    concat(headquaters_address,' ',cl.headquaters_city,' ',cl.headquaters_state,' ',cl.headquaters_pincode,' ',headquaters_country) as headQuarters,
    cl.gst as CINNumber,cl.logo as brandLogo from edgeapp.client as cl left join edgeapp.users as us on us.client_id = cl.client_id`;
    let getClients = await db.query(query);
    let getClientsValues = getClients.rows;

    var dataArr = getClientsValues.map(item=>{
      return [item.client_id,item]
    }); // creates array of array

    var newArray = new Map(dataArr);

    var result = [...newArray.values()];
    res.sendSuccess(result);
  }catch(error){
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
    return
  }
};

module.exports.BrandCreateValidate = async (req, res, next) => {
  try {
    let bodyData = req.body;
    let validate_error = [];

    if (!bodyData.hasOwnProperty("brandName") || bodyData.brandName == "") {
      validate_error.push("Brand Name is Required");
    } else if (
      bodyData.hasOwnProperty("brandName") &&
      bodyData.brandName.toString().length <= 2
    ) {
      validate_error.push("Brand Name is Invalid");
    }

    if (!bodyData.hasOwnProperty("dialCode") || bodyData.dialCode == "") {
      validate_error.push("Country Code is Required");
    }
    
    if (!bodyData.hasOwnProperty("name") || bodyData.name == "") {
      validate_error.push("User name is Required");
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

    if (validate_error.length > 0) {
      res.sendBadRequest(validate_error + ",");
      return;
    } else {
      next();
    }
    
  } catch (error) {
    res.sendServerError(error);
    return;
  }
};

module.exports.BrandDBValidate = async (req, res, next) => {
  try {
    // console.log("log1");
    const input = req.body;
    // input.without = req.params.id || '';
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

module.exports.validate_brand = async (input) => {
  try {
    let query = {
      brandName: input.brandName,
    };

    // if(input.without && input.without != ''){
    //   query._id = { $nin: [input.without] }
    // }

    let validate_b = await brandService.getOne(query);
    if (validate_b) {
      return "Brand";
    }else{
      return "";
    }
  } catch (error) {
    console.log("error =>", error);
    return error;
  }
};

module.exports.validate_email = async (input) => {
  try {
    let query = {
      email: input.email,
    };
    // if(input.without && input.without != ''){
    //   query._id = { $nin: [input.without] }
    // }
    // console.log("query =>", query);
    let validate_e = await Promise.all([
      brandService.getOne(query),
      userService.getOne(query),
    ]);
    if (validate_e[0] != null || validate_e[1]!= null) {
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

    // if(input.without && input.without != ''){
    //   query._id = { $nin: [input.without] }
    // }
    // console.log("query =>", query);
    let validate_p = await Promise.all([
      brandService.getOne(query),
      userService.getOne(query),
    ]);
    if (validate_p[0] != null || validate_p[1]!= null) {
      return "Phone";
    }
    return "";
  } catch (error) {
    return error;
  }
};

module.exports.brandApproval = async (req, res) => {
  try {
    const input = req.body;
    let query = {
      _id: req.params.id,
    };

    if(input.approved == true){
      input.active = true; 
    }else{
      input.active = false; 
    }

    let user = await brandService.getOne(query);
    if (!user) {
      res.sendBadRequest("Brand doesnot exists. Provide valid input.");
      return;
    }

    console.log("query =>", query);
    console.log("input =>", input);
    await brandService.updateOne(query, input);
    res.sendSuccess("Success! Brand updated successfully.");

  }catch(error){
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};