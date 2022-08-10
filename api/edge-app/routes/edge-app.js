/**
 * @name api_edge_app_routes
 * @description Edge App Routes
 */

// controllers
const auth = require('.././controllers/auth'),
    config = require('.././controllers/config'),
    rtsp = require('.././controllers/rtsp'),
    camera = require('.././controllers/camera'),
    edgeapp  = require('../controllers/edgeapp'),

    // middleware
    acl = require('../.././auth/middlewares/acl');

module.exports = app => {
    // app.route('/edgeapp/pair')
    //     .post(auth.pair);

    app.route('/edgeapp/config')
        .get(acl.isAllowed_edgeApp, config.get)
        .post(acl.isAllowed_edgeApp, config.post);

    // app.route('/edgeapp/rtsp')
    //     .get(acl.isAllowed, rtsp.get);

    // app.route('/edgeapp/preview')
    //     .get(acl.isAllowed, rtsp.getPreview)
    //     .post(acl.isAllowed, rtsp.postPreview);

    // app.route('/edgeapp/appversion')
    //     .post(acl.edgeAppIsAllowed,edgeapp.appVersion)

    // app.route('/edgeapp/hibernate')
    // .post(acl.edgeAppIsAllowed,edgeapp.apphibernate)

    //edgeapp-login
    app.route('/edgeapp/login')
    .post(edgeapp.login)
    //camera-operations
    app.route('/edgeapp/camera_operation')
    .post(acl.edgeAppIsAllowed,camera.camera_operation)
    .get(camera.cameraOperation)
};
