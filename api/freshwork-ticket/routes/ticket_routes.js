/**
 * @name api_ticketing_tool_routes
 * @description Ticketing Tool Routes
 * @author praveenraj
 */

const ticket = require("../controllers/ticket_controller");
const multer = require("multer");

var storage = multer.memoryStorage();
var uploadMem = multer({ storage: storage });

// middlewares
const acl = require('../.././auth/middlewares/acl');

module.exports = (app) => {
    app.route("/tickets/createTicket")
    .get(acl.isAllowed, ticket.list)
    .post(acl.isAllowed, ticket.create_ticket_c);

    app.route('/tickets/:id')
        .get(acl.isAllowed, ticket.find)
        .put(acl.isAllowed, ticket.update)
        .patch(acl.isAllowed, ticket.delete);
    
     app.route('/tickets/listAllConversations').post(acl.isAllowed, ticket.listAllConversations);

     app.route('/tickets/createReply').post(acl.isAllowed, ticket.createReply)

     app.route('/tickets/statusUpdate').post(acl.isAllowed, ticket.statusUpdate)

};