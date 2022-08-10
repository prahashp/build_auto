/**
 * @name api_core_controllers_monitor
 * @description System Monitor (Health) controller
 */

// timezones
const timezones = require('../../core/services/timezones');

module.exports.list = async (req, res) => {
    let timeZones = await timezones.getMany({});
    res.sendSuccess(timeZones);
};
