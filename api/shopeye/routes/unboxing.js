/**
 * @name api:shops:routes:videos
 * @description Video Tour Routes
 */

// controllers
const unboxing = require('../controllers/unboxing'),
    isUnboxing = require('../middlewares/isUnboxing'),
    upload = require('../modules/upload/s3-single'),
    acl = require("../../auth/middlewares/acl")

module.exports = app => {
    app.route('/shops/unboxing/upload-video')
        .post(acl.isAllowed, isUnboxing, upload, unboxing.upload);

    app.route('/shops/unboxing')
        .get(acl.isAllowed, unboxing.list)
        .post(acl.isAllowed, unboxing.new);

    app.route('/shops/unboxing/video/:id')
        .post(acl.isAllowed, isUnboxing, upload, unboxing.updateVideo)
        .put(acl.isAllowed, isUnboxing, upload, unboxing.updateVideo)

    app.route('/shops/unboxing/:id')
        .get(acl.isAllowed, unboxing.fetch)
        .put(acl.isAllowed, unboxing.update)
        .delete(acl.isAllowed, unboxing.delete);
};
