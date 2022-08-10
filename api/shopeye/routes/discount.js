/**
 * @name api:shops:routes:Discount
 * @description Authentication Routes
 * @author praveenraj
 */

const disController=require('../controllers/discount')
const acl = require("../../auth/middlewares/acl");
// controllers

module.exports=app=>{
    app.route('/shops/discount')
    .post(acl.isAllowed,disController.checkDiscount,disController.createDiscount)
   // .get(acl.isAllowed,disController.list)

    app.route('/shops/:id/discount')
    .put(acl.isAllowed,disController.update)
    .get(acl.isAllowed,disController.find)
    .patch(acl.isAllowed, disController.delete);

    app.route('/shops/discount/all')
    .post(acl.isAllowed,disController.list)
}