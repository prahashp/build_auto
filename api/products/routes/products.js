/**
 * @name api_products_routes
 * @description Products Routes
 */

// controllers
const controller = require('../controllers/products'),
    // middlewares
    acl = require('../../auth/middlewares/acl');

module.exports = app => {
    app.route('/products')
        .get(acl.isAllowed, controller.list)
        .post(acl.isAllowed, controller.create);
};
