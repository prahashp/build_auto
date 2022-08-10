/**
 * @name api:shops:routes:shelf
 * @description Authentication Routes
 */

// controllers
const shelfs = require('.././controllers/shelfs'),
    upload = require('../modules/upload/s3-single'),
    isShelf = require('../middlewares/isShelf'),
    acl =  require('../../auth/middlewares/acl')
    // authenticate = require('../middlewares/authenticate');


module.exports = app => {
    app.route('/shops/shelfs/upload-image')
        .post(acl.isAllowed, isShelf, upload, shelfs.upload);
    app.route('/shops/shelfs/upload-custom-image')
        .post(acl.isAllowed, isShelf, upload, shelfs.uploadCustomImage);
    app.route('/shops/shelfs-count')
        .get(acl.isAllowed, shelfs.count);
    app.route('/shops/shelfs')
        .get(acl.isAllowed, shelfs.list)
        .post(acl.isAllowed, upload, shelfs.new);
    app.route('/shops/shelfs/:id')
        .put(acl.isAllowed, shelfs.update)
        .get(acl.isAllowed, shelfs.fetch)
        .delete(acl.isAllowed, shelfs.delete)
};
