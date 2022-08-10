/**
 * @name api_core_controllers_monitor
 * @description System Monitor (Health) controller
 */

// package.json
const pkg = require('../../.././package.json');

module.exports.getHealth = (req, res) => {
    const response = {
        name: pkg.name,
        version: pkg.version
    };

    res.sendSuccess(response);
};
