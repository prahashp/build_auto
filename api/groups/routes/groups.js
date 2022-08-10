/**
 * @name api_stores_routes
 * @description Stores Routes
 */

// controllers
const groups = require('../controllers/group'),
permissions=require('../controllers/permission')

    // middlewares
    acl = require('../../auth/middlewares/acl');
const group = require('../models/group');

module.exports = app => {
    app.route('/groups')
        .post(acl.isAllowed, groups.new)
        .get(acl.isAllowed, groups.list);
    app.route("/groups/:id")
        .get(acl.isAllowed, groups.find)
        .put(acl.isAllowed, groups.update)
        .patch(acl.isAllowed, groups.delete);
    app.route('/groupsdetails')
        .get(acl.isAllowed, groups.list_details);
    app.route("/groupsdetails/:id")
        .get(acl.isAllowed, groups.find_details)
    app.route('/permissions/add')
    .post(acl.isAllowed, permissions.add)
    .get(acl.isAllowed, permissions.view);

    app.route('/getGroupforToolbar')
    .get(acl.isAllowed, groups.getGroupforToolbar);
};