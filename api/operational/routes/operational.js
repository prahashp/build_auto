const acl = require("../../auth/middlewares/acl");
const controller = require("../controllers/operational")
const validation = require("../../conversion_analysis/middlewares/index")

module.exports = (app) => {
    app.route("/operational/table")
    .post(acl.isAllowed, validation.inputValidater, controller.table);

    app.route("/operational/cameraDownTime")
    .post(acl.isAllowed, validation.inputValidater, validation.period_validate, validation.dateValidate, controller.cameraDownTime);

    app.route("/operational/graph")
    .post(acl.isAllowed, validation.inputValidater, validation.period_validate, controller.graph);

    app.route("/operational/openCloseTime")
    .post(acl.isAllowed, validation.inputValidater, validation.period_validate, controller.openCloseTime);

    app.route("/operational/overView")
    .post(acl.isAllowed, validation.inputValidater, validation.period_validate, controller.overView);

    app.route("/operational/avgOpenCloseOper")
    .post(acl.isAllowed, validation.inputValidater, controller.avgOpenCloseOper);

    app.route("/operational/avgInfraDown")
    .post(acl.isAllowed, validation.inputValidater, controller.avgInfraDown)
}