/**
 * @name api_alerts_controllers
 * @description Alerts Controller
 */

// services
const taggingService = require("../services/tagging"),
  storeService = require("../../stores/services/stores"),
  _ = require("lodash"),
  cameraService = require("../../camera/services/camera");
const oracle = require("../../core/modules/oracle");
// NPM Modules
bluebird = require("bluebird");

module.exports.list = (req, res) => {
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

    if (req.query.storeId) {
      input.query.store = req.query.storeId;
    }

    if (req.query.cameraId) {
      input.query.camera = req.query.cameraId;
    }

    input.record = {};
    input.limit = req.query.limit || 10;
    input.skip = req.query.limit * req.query.offset || 0;

    return new bluebird((resolve) => {
      resolve(input);
    })
      .then((params) => {
        return bluebird.all([
          taggingService.findLimit(
            params.query,
            params.record,
            params.skip,
            params.limit
          ),
          taggingService.getCount(params.query),
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

module.exports.listAllTags = async (req, res) => {
  try {
    let input = {};
    input.query = {};

    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }
    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }

    input.record = {};
    input.limit = Number(req.query.limit) || 10;
    input.skip = req.query.limit * req.query.offset || 0;
    // console.log("input =>", input);
    let [data, count] = await Promise.all([
      taggingService.getAll_Tag_Cam(input.query, input.skip, input.limit),
      taggingService.getCount(input.query),
    ]);
    await this.croppedPrevImages(data);
    res.status(200).json({ count, data });

    // return new bluebird((resolve) => {
    //   resolve(input);
    // })
    //   .then((params) => {
    //     return bluebird.all([
    //       taggingService.getAll_Tag_Cam(
    //         params.query,
    //         params.skip,
    //         params.limit
    //       ),
    //       taggingService.getCount(params.query),
    //     ]);
    //   })
    //   .spread((data, count) => {
    //    await this.croppedPrevImages(data)
    //     res.status(200).json({ count, data });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     res.status(500).json(error);
    //   });
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.getOne = async (req, res) => {
  try {
    let input = {};
    input._id = req.params.id;
    let tag = await taggingService.find(input);
    if (tag) {
      res.sendSuccess(tag);
    } else {
      res.sendServerError("no camers");
    }
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.create = async (req, res) => {
  try {
    let input = req.body;
    let storeQuery = [];
    let cameraQuery = [];
    let getstoresId = await storeService.getOne(
      { _id: input[0].store },
      { id: 1, _id: 0, brandId: 1 }
    );
    if (!req.user.brandId) {
      req.user.brandId = getstoresId.brandId;
    }

    for (let i = 0; i < req.body.length; i++) {
      input[i].brandId = req.user.brandId;
      storeQuery.push(req.body[i].store);
      cameraQuery.push(req.body[i].camera);
    }
    let deleteQuery = {
      store: { $in: storeQuery },
      camera: { $in: cameraQuery },
    };
    let tagdelete = await taggingService.delete(deleteQuery);
    let tagInsert = await taggingService.insertMany(input);

    tagInsert.forEach(async (element) => {
      var query = { _id: element.camera };
      var field_remove = { tagging: [] };
      var field = { tagging: element._id };
      let cameraTagRemove = await cameraService.updateMany(query, field_remove);
      let cameraUpdate = await cameraService.updateTag(query, field);
    });
    let data = await this.jsonUpload(tagInsert, getstoresId);
    if (data.code) {
      res.sendUnauthorized("Error in saving Data");
    }
    res.sendSuccess("Successfully tagged");
  } catch (error) {
    console.log("error =>", error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.baseimg = async (datas) => {
  try {
    let result = [];
    let query = {
      store: datas.store,
    };
    let fields = {
      no: 1,
      ip: 1,
      id: 1,
      streamName: 1,
    };
    let camDetails = await taggingService.camDetail(query, fields);
    if (camDetails.length == 0) {
      return "Data not found";
    }
    for (var i = 0; i < camDetails.length; i++) {
      let path = `${camDetails[i].store.id}/zone_base_images/${camDetails[i].store.id}_${camDetails[i].streamName}.jpeg`;
      const FE = await oracle.checkFileExist_tag(path);
      if (FE == 1) {
        const data = await oracle.getBaseImg(path);
        result.push({
          storeId: camDetails[i].store.id,
          baseImg: data,
          camNo: camDetails[i].no,
          ip: camDetails[i].ip,
          streamName: camDetails[i].streamName,
        });
      }
    }
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports.jsonUpload = async (data, storeId) => {
  try {
    let arr = [];
    await _.forEach(data, (res) => {
      let temp = `${res.tagName}|${res.streamName}`;
      arr.push({
        [temp]: res.coordinates,
      });
    });
    let jsonData = JSON.stringify({ zones: arr });
    let bucketPath = `${storeId.id}/zonetagging/${storeId.id}_zonetagging.json`;
    let upload = await oracle.jsonupload(bucketPath, jsonData);
    return upload;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.croppedPrevImages = async (data) => {
  try {
    for (var i = 0; i < data.length; i++) {
      var path = `${data[i].camera.storeId}/croppedImages/${data[i].tagName}_${data[i].streamName}.jpeg`;
      let filepath = await oracle.getCrpImg(path);
      data[i].tagBaseImage = filepath;
    }
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};