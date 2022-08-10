/**
 * @name api_alerts_routes
 * @description Alerts Routes
 */

// controllers
const controller = require('../controllers/tagging'),
    // middlewares
    acl = require('../../auth/middlewares/acl');;

module.exports = app => {
    app.route('/tagging')
        .get(acl.isAllowed, controller.list)
        .post(acl.isAllowed, controller.create);

    app.route('/tagging/:id')
        .get(acl.isAllowed, controller.getOne);
    app.route('/tagging_AllList')
    .get(acl.isAllowed, controller.listAllTags)


    app.route('/tagging/baseimg')
    .post(acl.isAllowed,controller.baseimg)
};
