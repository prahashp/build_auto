/**
 * @name api:shops:routes:videos
 * @description Video Tour Routes
 */

// controllers
const videoTour = require('../controllers/video-tour'),

    // modules
    isVideoTour = require('../middlewares/isVideoTour')
upload = require('../modules/upload/s3-single'),
    acl = require("../../auth/middlewares/acl")
// = require('../../core/middlewares/)

module.exports = app => {
    app.route('/shops/video-tour/upload-video')
        .post(acl.isAllowed, isVideoTour, upload, videoTour.upload);

    app.route('/shops/video-tour')
        .get(acl.isAllowed, videoTour.list)
        .post(acl.isAllowed, videoTour.new);

    app.route('/shops/video-tour/video/:id')
        .post(acl.isAllowed, isVideoTour, upload, videoTour.updateVideo)
        .put(acl.isAllowed, isVideoTour, upload, videoTour.updateVideo)

    app.route('/shops/video-tour/:id')
        .get(acl.isAllowed, videoTour.fetch)
        .put(acl.isAllowed, videoTour.update)
        .delete(acl.isAllowed, videoTour.delete);
};
