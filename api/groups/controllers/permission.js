/**
 * @name api_permission_controllers_dashboard
 * @description Permission Controller
 * @author praveenraj
 */
const _ = require("lodash"),
  brandService = require("../../superadmin/services/brand");
const tokenService = require("../../auth/services/tokens");
// services
module.exports.add = async (req, res) => {
  try {
    let brandData = await brandService.getOne({ _id: req.user.brandId });
    let query = {
      brandName: brandData.brandName,
    };
    const input = req.body,
      updateData = {};

    if (input.userType == "admin") {
      updateData.storeadmin = [input.permission[0]];
    } else {
      updateData.storeuser = [input.permission[0]];
    }
    await brandService.updateOne(query, updateData);
    return res.sendSuccess("Brand permissions added successfully!");
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.view = async (req, res) => {
  try {
    let roletype = req.query.type;

    let resultdata = {};
    if(req.user.brandId){
      let brandData = await brandService.getOne({ _id: req.user.brandId });
      // console.log("brandData =>", brandData);
      if(req.query.type =="user"){
        resultdata = brandData.storeuser;
      }else if (req.query.type =="admin") {
        resultdata = brandData.storeadmin;
      } else {
        resultdata = brandData;
      }
      return res.sendSuccess(resultdata);
    }else{
      return res.sendSuccess("nodata");
    }
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};
