/**
 * @name api
 * @description retail-api tango
 */

// configurations
const { environment: environment = 'production', port: port = 41020 } = require('./config').app;

// environment variables
process.env.NODE_ENV = process.env.NODE_ENV || environment;
process.env.PORT = process.env.PORT || port;

// connect db & start api server
const database = require('./api/core/modules/database');
database.connect(() => {
    const server = require('./config/api/server');
    server.start();
});