/**
 * @name api_alerts_routes
 * @description Alerts Routes
 */

// controllers
const controller = require('../controllers/camera'),
    // middlewares
    acl = require('../../auth/middlewares/acl');
    validation = require("../middleware/camera");

module.exports = app => {
    app.route('/camera')
        .get(acl.isAllowed, controller.list);
    
    app.route('/camera/addPostgres')   
        .post(validation.camera_validate, controller.addCamPost) 

    app.route('/camera/:id')
        .get(acl.isAllowed, controller.getOne);

    app.route('/camera/listing')
    .post(controller.camList)
};
