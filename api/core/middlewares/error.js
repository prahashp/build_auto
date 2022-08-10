/**
 * @name api_core_middelwares_error
 * @description It is used to handle the errors in Runtime.
 */

// NPM Modules
const http = require('http');

module.exports = (error, req, res, next) => {
    const code = parseInt(error.status) || 500;
    res.status(code)
        .jsonp({
            status: 'error',
            code: code,
            message: error.message || http.STATUS_CODES[code]
        });
};
