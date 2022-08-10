/**
 * @name api_alerts_controllers
 * @description Alerts Controller
 */

// services
const cameraService = require("../services/camera"),
  storeService = require("../../stores/services/stores");
const db = require("../../../config/database/postgres");
const { baseimg } = require("../../tagging/controllers/tagging");
const _ = require("lodash");
const oracle = require("../../core/modules/oracle");
// NPM Modules
bluebird = require("bluebird");

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

    if (req.query.storeId) {
      input.query.store = req.query.storeId;
    }

    input.record = {};
    input.limit = req.query.limit || 10;
    input.skip = req.query.limit * req.query.offset || 0;
    input.field = { thumbnailImage: 0, tagBaseImage: 0 };

    if (input.query.store) {
      let [data, count, imgData] = await Promise.all([
        cameraService.findLimit(
          input.query,
          input.skip,
          input.limit,
          input.field
        ),
        cameraService.getCount(input.query),
        baseimg(input.query),
      ]);
      await this.croppedImages(data);
      res.status(200).json({ data: data, count: count, imgData: imgData });
    } else {
      let [data, count] = await Promise.all([
        cameraService.findLimit(
          input.query,
          input.skip,
          input.limit,
          input.field
        ),
        cameraService.getCount(input.query),
      ]);
      res.status(200).json({ data: data, count: count });
    }


    // console.log(arrData);
    // console.log(img_data);
    // return new bluebird((resolve) => {
    //   resolve(input);
    // })
    //   .then((params) => {
    //     console.log("paramss =>", params);
    //     return bluebird.all([
    //       cameraService.findLimit(
    //         params.query,
    //         params.skip,
    //         params.limit,
    //         params.field
    //       ),
    //       cameraService.getCount(params.query),
    //       baseimg(params.query),
    //     ]);
    //   })
    //   .spread((data, count, test) => {
    //     var img_data = _.values(
    //       _.merge(_.keyBy(data, "streamName"), _.keyBy(test, "streamName"))
    //     );
    //     res.status(200).json({ count, img_data });
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
    let camera = await cameraService.find(input);
    if (camera) {
      res.sendSuccess(camera);
    } else {
      res.sendServerError("no camers");
    }
  } catch (error) {
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

// camera add operation in postgres db
module.exports.addCamPost = async (req, res) => {
  try {
    let data = req.body;
    let insertQuery;
    let selectQuery = await db.query(
      `SELECT id, client_id, client__id, store_id FROM edgeapp.store WHERE store_id ='${data[0].store_id}'`
    );
    let camera_insert = `INSERT INTO edgeapp.camera(client_id, client__id, store__id, store_id, ip, username, password, rtsp_url, stream_id, camera_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    // insertQuery = await db.query(camera_insert, [ selectQuery.rows[0].client_id, selectQuery.rows[0].client__id, selectQuery.rows[0].id, data[i].store_id, data[i].ip, data[i].username, data[i].password, data[i].rtsp_url, data[i].stream_id, data[i].camera_number])
    for (let i = 0; i < data.length; i++) {
      insertQuery = await db.query(camera_insert, [
        selectQuery.rows[0].client_id,
        selectQuery.rows[0].client__id,
        selectQuery.rows[0].id,
        data[i].store_id,
        data[i].ip,
        data[i].username,
        data[i].password,
        data[i].rtsp_url,
        data[i].stream_id,
        data[i].camera_number,
      ]);
      insertQuery.rowCount = i + 1;
    }
    if (insertQuery.rowCount == data.length) {
      return res.sendSuccess(
        `${insertQuery.rowCount} Camera Details Added SuccessFully`
      );
    }
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") res.sendBadRequest(error);
    else res.sendServerError(error);
  }
};

module.exports.croppedImages = async (data) => {
  try {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].tagging.length; j++) {
        // data[i].tagging[j].crpImg={}
        var path = `${data[i].store.id}/croppedImages/${data[i].tagging[j].tagName}_${data[i].tagging[j].streamName}.jpeg`;
        let filepath = await oracle.getCrpImg(path);
        data[i].tagging[j].tagBaseImage = filepath;
      }
    }
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports.camList = async (req, res) => {
  try {
    let input = {};
    input.data = req.body;
    input.query = `select store_id as store,stream_id  as streamName,rtsp_url as RTSP,ip,'' as manufacture, camera_number as no,username ,
     password,'' as subType, case when status =0 then 'false' when status=1 then 'true' end as isActivated,
     case when is_active =0 then 'false' when is_active =1 then 'true' end as isUp
     from edgeapp.camera as c 
     where date(created_at)='${input.data.cameraDate}'`;
    input.result = await db.query(input.query);
    res.sendSuccess({rows:input.result.rows,count:input.result.rowCount});
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};