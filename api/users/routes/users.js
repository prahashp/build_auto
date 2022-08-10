/**
 * @name api_stores_routes
 * @description Users Routes
 */

// controllers
const users = require('../controllers/users'),

    // middlewares
    acl = require('../../auth/middlewares/acl');

module.exports = app => {
    app.route('/usersnew')
        .get(acl.isAllowed, users.list)
        .post(acl.isAllowed, users.validate, users.create);

    app.route('/usersnew/:id')
        .get(acl.isAllowed, users.find)
        .put(acl.isAllowed, users.update_validate, users.update)
        .patch(acl.isAllowed, users.delete);

    app.route('/createMultipleusers')
        .post(acl.isAllowed,users.userlimit,users.bulkUploademailValidator,users.bulkUploadphoneValidator,users.createMultipleUsers ); //users.createMultipleUsers,
    // acl.isStoreAdmin,

    app.route('/usersWithoutLimit')
        .get(acl.isAllowed, users.listWithoutLimit);
    app.route('/searchUser')
        .post(acl.isAllowed, users.search);

    app.route('/assignGroup/:id')
        .post(acl.isAllowed, users.assignGroup);

    app.route('/overAllUsers')
        .get(acl.isAllowed, users.overAllUsers)
};
