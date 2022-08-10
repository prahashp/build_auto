/**
 * @name api_core_routes_monitor
 * @description System Monitor/Health Routes
 */

// controllers
const controller = require('.././controllers/monitor');

module.exports = app => {
    app.route('/health')
        .all(controller.getHealth);
};
