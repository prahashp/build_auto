/**
 * @name api_config_server
 * @description Load Express Framework and start the api server
 */

// NPM Modules
const http = require('http'),

    // Express
    express = require('./express');

module.exports.start = async () => {
    const app = express.init();
    const server = http.createServer(app);

    await new Promise(resolve => server.listen(process.env.PORT, resolve));
    console.log(`--: API Running in  ${process.env.NODE_ENV} environment at port: ${process.env.PORT} :--`);
};
