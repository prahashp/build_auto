const controller = require("../controllers/reports");
const acl = require("../../auth/middlewares/acl");
const validation = require("../../conversion_analysis/middlewares/index")
module.exports = (app) =>{
    app.route("/reports/templateA").post(acl.isAllowed, validation.isEmty, validation.dateValidate, controller.templateA);
    app.route("/reports/templateB").post(acl.isAllowed, validation.isEmty, validation.dateValidate, controller.templateB );
    app.route("/reports/templateC").post(acl.isAllowed, validation.isEmty, validation.dateValidate, controller.templateC);
    app.route("/reports/templateD").post(acl.isAllowed, validation.isEmty, validation.dateValidate, controller.templateD);
    app.route("/reports/customTemplate").post(acl.isAllowed, validation.isEmty, validation.dateValidate, controller.customTemplate);
}