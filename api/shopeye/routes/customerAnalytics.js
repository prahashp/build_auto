/**
 * @name api:shops:routes:Analytics
 * @description Customer Analytics Routes
 */

const custController=require('../controllers/customerAnalytics')

module.exports=app=>{
    app.route('/shops/customer/count')
    .get(acl.isAllowed,custController.count)
}