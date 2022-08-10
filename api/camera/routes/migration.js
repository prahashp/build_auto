/**
 * @name api_camera_migartion
 * @description CameraMigration
 */

const acl = require('.././middleware/migration-acl'),

    controller = require('.././controllers/migration'),
    db = require('.././controllers/db-bkp');

module.exports = app => {
    app.route('/migration/camera')
        .post(acl.isAllowed, controller.cameraEtl);

    app.route('/migration/stores')
        .post(acl.isAllowed, controller.storeEtl);

    app.route('/migration/users')
        .post(acl.isAllowed, controller.usersEtl);

    app.route('/migration/dbdump')
        .post(acl.isAllowed, db.dump);
};
