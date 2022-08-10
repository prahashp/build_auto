const controller = require("../controllers/traffic");
const acl = require("../../auth/middlewares/acl");
const validation = require("../../conversion_analysis/middlewares/index");

module.exports = (app) => {
  app
    .route("/traffic/overallAnalysis")
    .post(
      acl.isAllowed,
      validation.inputValidater,
      controller.overallAnalysis
    );
  app
    .route("/traffic/card")
    .post(
      acl.isAllowed,
      validation.inputValidater,
      validation.type_validate,
      controller.card
    );
  app
    .route("/traffic/groupAnalysis_time_prev")
    .post(acl.isAllowed, validation.imagedate, validation.timeRangeValidater, controller.timeBasedGrpAnalysis_prev);
  app
    .route("/traffic/groupAnalysis_time_thumb")
    .post(acl.isAllowed, validation.imagedate, controller.timeBasedGrpAnalysis_thumb);

  app
    .route("/traffic/groupAnalysis_range_thumb")
    .post(acl.isAllowed, validation.imagedate, controller.rangeAnalysisGrp_thumb);

  app
    .route("/traffic/groupAnalysis_range_prev")
    .post(acl.isAllowed, validation.imagedate, validation.timeRangeValidater, controller.rangeAnalysisGrp_prev);
  app
    .route("/traffic/table")
    .post(
      acl.isAllowed,
      validation.inputValidater,
      controller.table
    );
};
