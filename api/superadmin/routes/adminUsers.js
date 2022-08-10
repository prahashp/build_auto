/**
 * @name api_stores_routes
 * @description Users Routes
 */

// controllers
const adminUsers = require('../controllers/adminUsers'),

    // middlewares
    acl = require('../../auth/middlewares/acl');

module.exports = app => {
    app.route('/admin')
        .post(acl.isAllowed, adminUsers.createusers)
        .get(acl.isAllowed,  adminUsers.list)

    app.route('/admin/:id')
        .get(acl.isAllowed, adminUsers.find)
        .put(acl.isAllowed, adminUsers.update)
        .patch(acl.isAllowed, adminUsers.delete);
    
    app.route('/admin/brand/:id')
        .get(acl.isAllowed, adminUsers.find_brandUsers)
    
    app.route('/adminUsers')
        .get(acl.isAllowed,  adminUsers.listwithoutlimit)

        app.route('/admin/createMultipleusers')
        .post(acl.isAllowed,adminUsers.userlimit,adminUsers.bulkUploademailValidator,adminUsers.bulkUploadphoneValidator,adminUsers.createMultipleUsers );

};
