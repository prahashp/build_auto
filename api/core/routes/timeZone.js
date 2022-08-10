/**
 * @name api_core_routes_monitor
 * @description System Monitor/Health Routes
 */

// controllers
const controller = require('.././controllers/timeZones');

module.exports = app => {
    app.route('/timezones')
        .get(controller.list);
};
