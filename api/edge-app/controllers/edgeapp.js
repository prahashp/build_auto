/**
 * @name api_edge_app_controllers_edgeapp
 * @description Edge App Authentication
 */
// NPM Modules
const { Promise } = require("bluebird");
const _ = require("lodash"),
  config = require("../../../config").edgeapp_aws;
// modules
utils = require("../.././core/modules/utils");
//service
const storeService = require("../.././stores/services/stores"),
  tokenService = require("../../auth/services/tokens"),
  edgeappService = require("../services/edgeapp_service");
const { getDownloadLink } = require("../../core/modules/edgeapp_aws");
const db = require("../../../config/database/postgres");
const { getSHA256 } = require("../modules/edgeapp");

module.exports.login = async (req, res) => {
  try {
    const query = {
      appId: _.get(req.body, "app_id", null),
    };
    let data = await storeService.getOne(query);
    if (!data) {
      return res.edgeappError();
    } else {
      let dataToken = `${data.id}_${data._id}_${
        data.appId
      }_${utils.getUuid()}_${req.body.architecture}_${
        req.body.current_version
      }`;
      const authToken = {
        type: "edgeapp-access-token",
        token: await getSHA256(dataToken),
        store: data._id,
      };
      let speed_test = {
        speedTest: req.body.speedTest,
        storeId: data._id,
        brandId: data.brandId,
        logType: "speedtest",
      };
      let output = {};
      if (data.edgeAppToken) {
        let edgeapp = await edgeappService.get();
        await edgeappService.insert_speedtest(speed_test);
        if (req.body.architecture == "x32") {
          let filePath = config.filepath_32.path;
          const urlLink = await getDownloadLink(filePath);
          output.app_id = data.appId;
          output.app_version_id = edgeapp[0].app_version;
          output.host_url = urlLink;
          output.store_id = data.id;
          output.message = "App paired successfully";
          output.accessToken = data.edgeAppToken;
        } else {
          let filePath = config.filepath_64.path;
          const urlLink = await getDownloadLink(filePath);
          output.app_id = data.appId;
          output.app_version_id = edgeapp[0].app_version;
          output.host_url = urlLink;
          output.store_id = data.id;
          output.message = "App paired successfully";
          output.accessToken = data.edgeAppToken;
        }
      } else {
        let [store, edgeapp, speedtest] = await Promise.all([
          storeService.updateOne(
            { _id: data._id },
            {
              paired: true,
              edgeAppToken: authToken.token,
              appVersion: req.body.current_version,
              architecture: req.body.architecture,
            }
          ),
          edgeappService.get(),
          edgeappService.insert_speedtest(speed_test),
        ]);
        if (req.body.architecture == "x32") {
          let filePath = config.filepath_32.path;
          const urlLink = await getDownloadLink(filePath);
          output.app_id = data.appId;
          output.app_version_id = edgeapp[0].app_version;
          output.host_url = urlLink;
          output.store_id = data.id;
          output.message = "App paired successfully";
          output.accessToken = authToken.token;
        } else {
          let filePath = config.filepath_64.path;
          const urlLink = await getDownloadLink(filePath);
          output.app_id = data.appId;
          output.app_version_id = edgeapp[0].app_version;
          output.host_url = urlLink;
          output.store_id = data.id;
          output.message = "App paired successfully";
          output.accessToken = authToken.token;
        }
      }

      return res.edgeAppsendSuccess(output);
    }
  } catch (error) {
    console.error(error);
    return res.edgeappError();
  }
};

// module.exports.appVersion = async (req, res) => {
//   try {
//     let output = {};
//     const query = {
//       appId: _.get(req.body, "app_id", null),
//       active: true,
//     };
//     let data = await storeService.getOne(query);
//     if (!data) {
//       return res.edgeappError();
//     } else {
//       if (req.body.architecture == "x32") {
//         let filePath = config.filepath_32.path;
//         const urlLink = await getDownloadLink(filePath);
//         output.app_version_id = data.appVersion;
//         output.host_url = urlLink;
//       } else {
//         let filePath = config.filepath_64.path;
//         const urlLink = await getDownloadLink(filePath);
//         output.app_version_id = data.appVersion;
//         output.host_url = urlLink;
//       }
//       return res.edgeAppsendSuccess(output);
//     }
//   } catch (error) {
//     console.error(error);
//     return res.edgeappError();
//   }
// };

// module.exports.apphibernate = async (req, res) => {
//   try {
//     let storeInfo = {};
//     storeInfo.hibernet = {
//       enabled: true,
//       startTime: req.body.hibernate_start_time,
//       endTime: req.body.hibernate_end_time,
//     };
//     await storeService.updateOne(
//       { id: req.body.store_id, active: true },
//       storeInfo
//     );
//     return res.edgeAppsendSuccess();
//   } catch (error) {
//     console.error(error);
//     return res.edgeappError();
//   }
// };

// //edgeapp-login
// module.exports.login_back = async (req, res) => {
//   try {
//     console.log(req.body);
//     let output = {},
//       authToken = "";
//     let speedtest_query =
//       "insert into edgeapp.speed_test(download_speed,upload_speed,store_id,created_at)values($1,$2,$3,now());";
//     let query = `update edgeapp.sdk_auth set app_version_id=$1,architecture=$2,is_active = 1,updated_at=now() , app_status='paired' `;
//     let whereCondition = `where app_id=$3 and store_id=$4`;
//     let data = await db.query(
//       `select * from edgeapp.sdk_auth where app_id=$1`,
//       [req.body.app_id]
//     );
//     if (data.rowCount == 0) {
//       return res.edgeappError();
//     }

//     if (data.rows[0].access_token == null) {
//       let dataToken = `${data.rows[0].store_id}_${data.rows[0].store__id}_${
//         data.rows[0].app_id
//       }_${utils.getUuid()}`;
//       authToken = await getSHA256(dataToken);
//       query = `${query} ,access_token= '${authToken}' ${whereCondition}`;
//       output.accessToken = authToken;
//     } else {
//       query = `${query} ${whereCondition}`;
//       output.accessToken = data.rows[0].access_token;
//     }

//     let version = await db.query("select * from edgeapp.appversion");

//     if (req.body.architecture == "x32") {
//       let filePath = config.filepath_32.path;
//       const urlLink = await getDownloadLink(filePath);
//       output.app_id = data.rows[0].app_id;
//       output.app_version_id = version.rows[0].version;
//       output.host_url = urlLink;
//       output.store_id = data.rows[0].store_id;
//       output.message = "App paired successfully";

//       let [sdkauth, store, speedtest] = await Promise.all([
//         await db.query(query, [
//           version.rows[0].version,
//           req.body.architecture,
//           data.rows[0].app_id,
//           data.rows[0].store_id,
//         ]),
//         await db.query(
//           "update edgeapp.Store set is_active = 1,updated_at=now() where store_id=$1",
//           [data.rows[0].store_id]
//         ),
//         await db.query(speedtest_query, [
//           req.body.speedTest[0].download,
//           req.body.speedTest[0].upload,
//           data.rows[0].store_id,
//         ]),
//       ]);
//     } else {
//       let filePath = config.filepath_64.path;
//       const urlLink = await getDownloadLink(filePath);
//       output.app_id = data.rows[0].app_id;
//       output.app_version_id = version.rows[0].version;
//       output.host_url = urlLink;
//       output.store_id = data.rows[0].store_id;
//       output.message = "App paired successfully";

//       let [sdkauth, store] = await Promise.all([
//         await db.query(query, [
//           version.rows[0].version,
//           req.body.architecture,
//           data.rows[0].app_id,
//           data.rows[0].store_id,
//         ]),
//         await db.query(
//           "update edgeapp.Store set is_active = 1,updated_at=now() where store_id=$1",
//           [data.rows[0].store_id]
//         ),
//         await db.query(speedtest_query, [
//           req.body.speedTest[0].download,
//           req.body.speedTest[0].upload,
//           data.rows[0].store_id,
//         ]),
//       ]);
//     }
//     return res.edgeAppsendSuccess(output);
//   } catch (error) {
//     console.error(error);
//     return res.edgeappError();
//   }
// };
// //ips
// module.exports.ips = async (req, res) => {
//   try {
//     let query = `insert into edgeapp.ips_list (store_id,ip) values($1,$2)`;
//     await db.query(query, [req.body.storeId, JSON.stringify(req.body.ips)]);
//     return res.edgeAppsendSuccess("Added");
//   } catch (error) {
//     console.error(error);
//     return res.edgeappError();
//   }
// };

// //ip_list
// module.exports.ip_list = async (req, res) => {
//   try {
//     let query = ` select store_id,ip,created_at as last_updated from edgeapp.ips_list where store_id ='${req.body.storeId}' and date(created_at)=date(now()) order by created_at desc limit 1`;
//     let data = await db.query(query);
//     if (data.rowCount > 0) {
//       return res.edgeAppsendSuccess(data.rows);
//     } else {
//       return res.edgeappError();
//     }
//   } catch (error) {
//     console.error(error);
//     return res.edgeappError();
//   }
// };
