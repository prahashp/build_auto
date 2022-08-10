
/**
 * @name api_core_routes_s3upload
 * @description System Monitor/Health Routes
 */

// controllers
const { upload } = require('../modules/aws')
const uploadController = require('../controllers/upload')
module.exports = app => {
    app.route('/uploadSingleFileCore')
        .post( uploadController.upload);
};
