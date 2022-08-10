/**
 * @name api:shops:routes:shelf
 * @description Authentication Routes
 */

// controllers
const products = require('../controllers/products'),
acl=require("../../auth/middlewares/acl")

    // modules
    upload = require('../modules/upload/s3-single'),
    // authenticate = require('../../core/middlewares/authenticate'),
    isProduct = require('../middlewares/isProduct');

module.exports = app => {
    app.route('/shops/products/upload-image')
        .post( acl.isAllowed, isProduct, upload, products.upload);

    app.route('/shops/products')
        .get(acl.isAllowed, products.list)
        .post( acl.isAllowed,products.new);

    app.route('/shops/products/:id')
        .get(acl.isAllowed, products.fetch)
        .put( acl.isAllowed,products.update)
        .delete(acl.isAllowed, products.delete);
};
