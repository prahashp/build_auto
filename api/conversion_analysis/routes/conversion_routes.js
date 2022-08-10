/**
 * @name api_stores_routes
 * @description Stores Routes
 * @author praveenraj
 */

const dashboard = require("../controllers/conversion_controller");
const validation = require("../middlewares/index");
const acl = require("../../auth/middlewares/acl");

module.exports = (app) => {
  app
    .route("/conversion/card")
    .post(
      acl.isAllowed,
      validation.inputValidater,
      dashboard.card
    );
  app
    .route("/conversion/table")
    .post(
      acl.isAllowed,
      validation.inputValidater,
      dashboard.table
    );
  app
    .route("/conversion/dwell")
    .post(
      acl.isAllowed,
      validation.inputValidater,
      dashboard.dwell
    );
  app
    .route("/conversion/graph")
    .post(
      acl.isAllowed,
      validation.period_validate,
      validation.inputValidater,
      dashboard.graph
    );
  app
    .route("/conversion/image_date")
    .post(acl.isAllowed, validation.imagedate, dashboard.image_data);

  app
    .route("/conversion/conversion-analysis")
    .post(
      acl.isAllowed,
      validation.inputValidater,
      validation.period_validate,
      dashboard.conversionAnalysis_graph
    );
  app.route("/conversion/videoData").post(acl.isAllowed, validation.imagedate, dashboard.video_data);
  app.route("/conversion/camera_down_time").post(acl.isAllowed, validation.imagedate, dashboard.cameraDownTime);

  app.route("/conversion/directory_download").post(acl.isAllowed, dashboard.directoryDownload)
};
