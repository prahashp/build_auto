/**
 * @name api:shops:routes:leads
 * @description Leads Routes
 */

// controllers
const leads = require('.././controllers/leads'),
acl = require('../../auth/middlewares/acl')

module.exports = app => {
    app.route('/leads/analytics/customer')
        .get(acl.isAllowed, leads.getCustomerReports);

    app.route('/leads/analytics/products/:id')
        .get(acl.isAllowed, leads.getProductAnalytics);

    app.route('/leads/analytics/filter-products')
        .post(acl.isAllowed, leads.filteredReports);
        
};
