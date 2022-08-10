/**
 * @name api:shops:routes:client
 * @description Client Routes
 */

// controllers
const client = require('.././controllers/client'),
acl =  require('../../auth/middlewares/acl')

module.exports = app => {
    app.route('/shops/:shopId/products')
        .get(client.getProducts);

    app.route('/shops/:shopId/products/:productId')
        .get(client.getProduct);

    app.route('/shops/:shopId/unboxing/:videoId')
        .get(client.getUnboxingVideos);

    app.route('/shops/:shopId/unboxing')
        .get(client.getUnboxingVideosList);

    app.route('/shops/:shopId/videotour')
        .get(client.getvideotourVideosList);

    app.route('/orders')
        .get(acl.isAllowed, client.getOrders)
        .post(client.createOrder);

    app.route('/orders/:orderId')
        .get(acl.isAllowed, client.getOrderById)
        .put(acl.isAllowed, client.updateOrders)

    app.route('/shops/:shopId/info')
        .get(client.getShopInfo);

    app.route('/shops/:shopId/shelf/:shelfId')
        .get(client.getShelfInfo);

    app.route('/shops/:shopId/shelf/:shelfId/products/:productId')
        .get(client.getShelfProductInfo);
};
