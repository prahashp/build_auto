/**
 * @name api_alerts_routes
 * @description Alerts Routes
 */

// controllers
const controller = require('.././controllers/alerts'),
    // middlewares
    acl = require('../../auth/middlewares/acl');;

module.exports = app => {
    app.route('/alerts')
        .get(acl.isAllowed, controller.get)
        .post(acl.isAllowed, controller.insert);
};
