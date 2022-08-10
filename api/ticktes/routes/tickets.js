/**
 * @name api_tickets_routes
 * @description Tickets Routes
 */

// controllers
const controller = require('../controllers/ticktes'),
    // middlewares
    acl = require('../../auth/middlewares/acl');

module.exports = app => {
    app.route('/tickets')
        .get(acl.isAllowed, controller.list)
        .post(acl.isAllowed, controller.create);

    app.route('/ticket/:id')
        .get(acl.isAllowed, controller.getOne)
        .put(acl.isAllowed, controller.update);

    app.route('/ticketDetails/:id')
        .get(acl.isAllowed, controller.getTicketDetails)
        .post(acl.isAllowed, controller.addTicketDetails);

    app.route('/ticketStatusChange/:id')
        .post(acl.isAllowed, acl.isAdminUsers, controller.ticketStatusChange);

    app.route('/ticketAssign/:id')
        .post(acl.isAllowed, acl.isAdminUsers, controller.ticketAssign);
};
