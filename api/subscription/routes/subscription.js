/**
 * @name api_subscription_routes
 * @description subscription Routes
 */

// controllers
const controller = require('../controllers/subscription'),
    // middlewares
    acl = require('../../auth/middlewares/acl');

module.exports = app => {
    app.route('/subscription')
        .get(acl.isAllowed, controller.list)
        .post(acl.isAllowed, controller.create);

    app.route('/subscription/:id')
        .get(acl.isAllowed, controller.getOne)
        .put(acl.isAllowed, controller.update);
};
