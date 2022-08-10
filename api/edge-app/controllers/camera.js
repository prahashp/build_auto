/**
 * @name api_edge_app_controllers_camera
 * @description Camera controller
 */

// NPM Modules
const _ = require("lodash"),
  bluebird = require("bluebird"),
  // services
  cameraService = require("../../camera/services/camera");
const db = require("../../../config/database/postgres"),
edgeappService = require("../.././edge-app/services/edgeapp_service");;

module.exports.ips = async (req, res) => {
  try {
    let input = req.body,
      logInput = {};
    logInput.storeId = req.data._id;
    logInput.brandId = req.data.brandId._id;
    logInput.ips = input.ips;
    await edgeappService.insert(logInput);
    return res.sendSuccess("Ip added");
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.camera_operation = async (req, res) => {
  try {
    let data = req.body;
    data.client = _.split(data.store_id, "-", 1);
    for (var i = 0; i < data.cameras.length; i++) {
      let stream_query = `select * from edgeapp.stream where stream_id=$1 and store_id=$2`;
      let stream_data = await db.query(stream_query, [
        data.cameras[i].stream_id,
        data.store_id,
      ]);
      let queryInsert = `INSERT INTO edgeapp.camera_operation (store_id, client_id, store_date, camera_name, stream_id, downtime) VALUES ('${data.store_id}',${data.client},'${data.store_date}','${stream_data.rows[0].camera_number}','${data.cameras[i].stream_id}',${data.cameras[i].downtime}) RETURNING *`;
      let result = await db.query(queryInsert);
    }
    return res.edgeAppsendSuccess();
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.cameraOperation = async (req, res) => {
  try {
    let query = `select * from edgeapp.camera_operation where date(created_at)='${req.body.date}' and store_id='${req.body.storeId}'`;
    let data = await db.query(query);
    if (data.rowCount > 0) {
      return res.edgeAppsendSuccess(data.rows);
    } else {
      return res.edgeappError();
    }
  } catch (error) {
    console.error(error);
    return res.edgeappError();
  }
};
