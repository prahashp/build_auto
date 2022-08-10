/**
 * @name api_stores_modules_stores
 * @description Store Wrapper Methods
 */

// NPM Modules
const otp = require('otp-generator');

module.exports.generateAppId = () => {
    return otp.generate(7, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });
};
