const acl = require("../../auth/middlewares/acl");
const cusController=require('../controllers/customer')

module.exports=app=>{
    app.route('/shops/cusData')
    .post(acl.isAllowed,cusController.checkCust,cusController.createCust)

    app.route('/shops/:id/cusData')
    .put(acl.isAllowed,cusController.update)
    .get(acl.isAllowed,cusController.find)

    app.route('/shops/cusData/all')
    .post(acl.isAllowed,cusController.listall)

    app
    .route("/shops/custUpload")
    .post(acl.isAllowed, cusController.checkcustNo,cusController.bulkEmp);
}