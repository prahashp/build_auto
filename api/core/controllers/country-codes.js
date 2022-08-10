/**
 * @name api_core_controllers_monitor
 * @description System Monitor (Health) controller
 */

// timezones
const countryCode = require('../services/countryCodes');

module.exports.list = async (req, res) => {
    let countryCodes = await countryCode.getMany({});
    res.sendSuccess(countryCodes);
};
