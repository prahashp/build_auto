/**
 * @name api:shops:routes:Employee
 * @description Authentication Routes
 * @author praveenraj
 */

const empController = require("../controllers/emp");
const acl = require("../../auth/middlewares/acl");
// controllers

module.exports = (app) => {
  app
    .route("/shops/empData")
    .post(acl.isAllowed, empController.checkEmp, empController.createEmp);
  //  .get(acl.isAllowed,empController.listall)

  app
    .route("/shops/:id/empData")
    .put(acl.isAllowed, empController.update)
    .get(acl.isAllowed, empController.find);

  app.route("/shops/empData/all").post(acl.isAllowed, empController.listall);

  app
    .route("/shops/empUpload")
    .post(acl.isAllowed, empController.checkEmpNo, empController.checkEmpEmail,empController.bulkEmp);
};
