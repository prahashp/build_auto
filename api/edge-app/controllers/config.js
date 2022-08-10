/**
 * @name api_edge_app_controllers_config
 * @description Config Controllers
 */

// NPM Modules
const bluebird = require("bluebird"),
  _ = require("lodash"),
  // services
  storeService = require("../.././stores/services/stores"),
  cameraService = require("../.././camera/services/camera"),
  edgeappService = require("../services/edgeapp_service");
const { createStream } = require("../modules/edgeapp");

module.exports.post = async (req, res) => {
  try {
    const input = req.body;
    const storeInfo = {},
      speedtest = {},
      logInput = {},
      promises = [];
    let camno = 0;
    // Store Data Formation
    //  if (_.get(input, "ClientStoreCredentials", null)) {
    // storeInfo.appVersion = _.get(
    //   input,
    //   "ClientStoreCredentials.ApplicationVersion",
    //   null
    // );
    storeInfo.paired = true;
    storeInfo.configured = true;
    storeInfo.updatedAt = new Date();

    let errorIp = '';

    //}

    //Store Hibernation
    if (_.get(input, "HibernationSettings", null)) {
      storeInfo.hibernet = {
        enabled: _.get(
          input,
          "HibernationSettings.IsHibernationEnabled",
          false
        ),
        startTime: _.get(
          input,
          "HibernationSettings.StartHibernationTime",
          false
        ),
        endTime: _.get(input, "HibernationSettings.EndHibernationTime", false),
      };
      storeInfo.configured = true;
      storeInfo.updatedAt = new Date();
    }

    //Store Speed Test
    if (_.get(input, "speedTest", null)) {
      speedtest.speedTest = _.get(input, "speedTest", null);
      speedtest.storeId = req.data._id;
      speedtest.brandId = req.data.brandId._id;
      speedtest.logType = "speedtest";
      await edgeappService.insert_speedtest(speedtest);
    }

    ////Scan IP List added
    if (_.get(input, "ips", null)) {
      logInput.storeId = req.data._id;
      logInput.brandId = req.data.brandId._id;
      logInput.ips = input.ips;
      await edgeappService.insert(logInput);
    }
    if (Object.keys(storeInfo).length > 0) {
      storeService.updateOne(
        {
          _id: req.data._id,
        },
        storeInfo
      );
    }
    // camera stream addition
    if (_.get(input, "VideoStreamList", null)) {
      let inputQuery = {
        store: req.data._id,
      };
      var datetime = new Date();
      let count = await cameraService.getCount(inputQuery);

      _.forEach(_.get(input, "VideoStreamList", []), async (record) => {
        const doc = {};
        if (_.get(record, "streamName", null)) {
          doc.streamName = _.get(record, "streamName", null);
          doc.store = req.data._id;
          doc.ip = _.get(record, "ip", null);
          doc.manufacture = _.get(record, "manufacture", null);
          doc.brandId = req.data.brandId._id;
          doc.username = _.get(record, "username", null);
          doc.password = _.get(record, "password", null);
          doc.subType = _.get(record, "subType", null);
          doc.RTSP = _.get(record, "RtspUrl", null);
          doc.retentionPeriod = _.get(record, "RetentionPeriod", 0);
          doc.thumbnailImage = _.get(record, "thumbnailImage", null);
          doc.isUp = _.get(record, "IsUp", false);
          doc.isActivated = _.get(record, "isActivated", false);
          doc.no = _.get(record, "cameraNo", null);
          doc.updatedAt = new Date();
        } else {
          doc.store = req.data._id;
          doc.ip = _.get(record, "ip", null);
          doc.manufacture = _.get(record, "manufacture", null);
          //doc.no =`cam${_.get(record, "CameraNumber")}`;
          if (camno == 0) {
            doc.no = `cam${count + 1}`;
            doc.tempno = count + 1;
            camno = doc.tempno;
          } else {
            doc.no = `cam${camno + 1}`;
            doc.tempno = camno + 1;
            camno = doc.tempno;
          }
          doc.brandId = req.data.brandId._id;
          doc.username = _.get(record, "username", null);
          doc.password = _.get(record, "password", null);
          doc.subType = _.get(record, "subType", null);
          doc.RTSP = _.get(record, "RtspUrl", null);
          doc.retentionPeriod = _.get(record, "RetentionPeriod", 0);
          doc.streamName = createStream(`${req.data.id}cam${camno}${datetime}`);
          doc.thumbnailImage = _.get(record, "thumbnailImage", null);
          doc.isUp = _.get(record, "IsUp", false);
          doc.isActivated = _.get(record, "isActivated", false);
          doc.updatedAt = new Date();
        }

        var checkip = { ip: doc.ip }
        let existingIP = await cameraService.getOne(checkip);
        if (existingIP && existingIP.ip != '' && existingIP.ip != null) {
          promises.push(
            cameraService.updateOne(
              {
                streamName: doc.streamName,
                store: doc.store,
              },
              doc
            )
          );
        } else {
          errorIp = errorIp + existingIP.ip + ',';
        }

        promises.push(doc);
      });
    }

    //camera preview image
    if (_.get(input, "thumbNail", null)) {
      _.forEach(_.get(input, "thumbNail", []), (record) => {
        const doc = {};
        doc.store = req.data._id;
        doc.thumbnailImage = _.get(record, "thumbnailImage", null);
        doc.streamName = _.get(record, "streamName", null);
        doc.updatedAt = new Date();
        promises.push(
          cameraService.updateOne(
            {
              streamName: doc.streamName,
              store: doc.store,
            },
            doc
          )
        );
        promises.push(doc);
      });
    }

    //streaming status
    if (_.get(input, "Streaming", null)) {
      _.forEach(_.get(input, "Streaming", []), (record) => {
        const doc = {};
        doc.store = req.data._id;
        doc.isUp = _.get(record, "isUp", false);
        doc.streamName = _.get(record, "streamName", null);
        doc.updatedAt = new Date();
        promises.push(
          cameraService.updateOne(
            {
              streamName: doc.streamName,
              store: doc.store,
            },
            doc
          )
        );
        promises.push(doc);
      });
    }

    new bluebird.all(promises)
      .then(() => {
        res.sendSuccess({
          message: "Configuration updated successfully",
          error: errorIp
        });
      })
      .catch((error) => {
        console.log(error);
        res.sendServerError(error);
      });
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

module.exports.get = async (req, res) => {
  try {
    const store = req.data;
    const result = {};
    // Store
    result.ClientStoreCredentials = {
      AppId: store.appId,
      ApplicationVersion: store.appVersion,
      StoreId: store.id,
      paired: store.paired,
      configured: store.configured,
    };

    //hibernation
    result.HibernationSettings = {};
    if (store.hibernet) {
      result.HibernationSettings.IsHibernationEnabled = store.hibernet.enabled;
      result.HibernationSettings.StartHibernationTime =
        store.hibernet.startTime;
      result.HibernationSettings.EndHibernationTime = store.hibernet.endTime;
    }

    //list of ips
    await edgeappService
      .get_ip({ storeId: store._id, brandId: store.brandId._id })
      .then((records) => {
        result.ips = [];
        _.forEach(records, (record) => {
          _.forEach(record.ips, (rec) => {
            result.ips.push({
              ip: rec.ip,
              manufacturer: rec.manufacturer,
              macId: rec.macId,
            });
          });
        });
      });

    //speedTest
    await edgeappService
      .list_speedtest({
        storeId: store._id,
        brandId: store.brandId._id,
      })
      .then((records) => {
        result.speedTest = [];
        _.forEach(records, (record) => {
          _.forEach(record.speedTest, (rec) => {
            result.speedTest.push({
              download: rec.download,
              upload: rec.upload,
              datetime: record.createdAt,
            });
          });
        });
      });

    //camera
    await cameraService
      .get({ store: store._id }, { _id: 0, createdAt: 0, updatedAt: 0 })
      .then((records) => {
        result.VideoStreamList = [];
        _.forEach(records, (record) => {
          result.VideoStreamList.push({
            ip: record.ip,
            cameraNo: record.no,
            manufacture: record.manufacture,
            username: record.username,
            password: record.password,
            subType: record.subType,
            RtspUrl: record.RTSP,
            streamName: record.streamName,
            thumbnailImage: record.thumbnailImage,
            IsActivated: record.isActivated,
            IsUp: record.isUp,
            subType: record.subType,
            RetentionPeriod: record.retentionPeriod,
          });
        });
      });

    res.sendSuccess(result);
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }

  // // Cameras
  // cameraService
  //   .get(
  //     {
  //       store: req.store._id,
  //     },
  //     {
  //       _id: 0,
  //       createdAt: 0,
  //       createdAt: 0,
  //     }
  //   )
  //   .then((records) => {
  //     result.VideoStreamList = [];
  //     _.forEach(records, (record) => {
  //       result.VideoStreamList.push({
  //         CamStoreId: store.id,
  //         ip: record.ip,
  //         manufacture: record.manufacture,
  //         CameraNumber: record.no,
  //         username: record.username,
  //         password: record.password,
  //         subType: record.subType,
  //         RtspUrl: record.RTSP,
  //         RetentionPeriod: record.retentionPeriod,
  //         // streamName: record.streamName,
  //         thumbnailImage: record.thumbnailImage,
  //         IsActivated: record.isActivated,
  //         IsUp: record.isUp,
  //       });
  //     });

  //     res.sendSuccess(result);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.sendServerError(error);
  //   });
};
