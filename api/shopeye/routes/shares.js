/**
 * @name api:shops:routes:shelf
 * @description Authentication Routes
 */

// controllers
const shares = require('../controllers/shares'),
    uuid = require('../middlewares/generateUUID'),
    acl =  require("../../auth/middlewares/acl")

module.exports = app => {
    app.route('/share/count/:isPercentageRequired')
        .get(acl.isAllowed, shares.count);
    app.route('/share')
        .get(acl.isAllowed, shares.list)
        .post(acl.isAllowed, uuid, shares.new);
    app.route('/share/sort-by/:category/:skip')
        .get(acl.isAllowed, shares.sortCategoryByShares);
    app.route('/share/:id')
        .get(acl.isAllowed, shares.fetch);
};
