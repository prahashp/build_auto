/**
 * @name api_config
 * @description Application Configurations
 */

// NPM Modules
const _ = require('lodash');

// configurations
const config = {
    api: {
        version: 'v1'
    },

    // account encryptions
    crypto: {
        algorithm: 'aes-192-cbc',
        key: 'ret@il-@pi-v1'
    },

    // auth
    auth: {
        tokenExpires: 12 * 60 * 60, // hours
        urls: {
            verifyAccount: '/auth/account-verify'
        }
    },
};

module.exports = _.merge({}, config, require('./env'));
