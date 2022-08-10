/**
 * @name api_stores_routes
 * @description Stores Routes
 */

// controllers
const stores = require('.././controllers/stores'),

    // middlewares
    acl = require('../.././auth/middlewares/acl');

module.exports = app => {
    app.route('/adminstores')
        .post(acl.isAllowed, acl.isSuperAdmin, stores.new)
        .get(acl.isAllowed, acl.isSuperAdmin, stores.list);
    app.route("/adminstores/:id")
        .get(acl.isAllowed, acl.isSuperAdmin, stores.find)
        .put(acl.isAllowed, acl.isSuperAdmin, stores.update)
        .patch(acl.isAllowed, acl.isSuperAdmin, stores.delete);
};
