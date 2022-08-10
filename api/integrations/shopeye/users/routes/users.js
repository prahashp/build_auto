/**
 * @name api_stores_routes
 * @description Users Routes
 */

// controllers
const users = require('../controllers/users'),
    shops = require('../controllers/shops'),

    // middlewares
    { apiPrefix } = require('../../core/constants')
    acl = require('../../../../auth/middlewares/acl');

module.exports = app => {
    app.route(apiPrefix+ '/users')
        .get(users.list)
        .post(users.create);

    app.route(apiPrefix+ '/users/:id')
        .get(users.find)
        .put(users.update)
        .patch(acl.isAllowed, users.delete);

    app.route(apiPrefix+ '/shops')
        .get(shops.list)
        .post(acl.isAllowed, shops.create);

};
