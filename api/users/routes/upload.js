
/**
 * @name api_core_routes_s3upload
 * @description System Monitor/Health Routes
 */

// controllers
const { upload } = require('../../core/modules/aws')
const uploadController = require('../../core/controllers/upload')

const acl = require('../../auth/middlewares/acl');
module.exports = app => {
    app.route('/uploadSingleFile')
        .post(acl.isAllowed,uploadController.upload);

    app.route('/driveFileUpload')
        .post(uploadController.driveUpload);
};
