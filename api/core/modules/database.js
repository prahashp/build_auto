/**
 * @name api_core_modules_database
 * @description Database Connection
 */

// NPM Modules
const bluebird = require('bluebird'),
    mongoose = require('mongoose'),

    // configuration
    config = require('../../.././config').database;


module.exports.getSpec = () => {
    const { hostname, name, username, password, replicaSet, connectionTimeoutMS } = config;
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    let connectionString = `${hostname}/${name}?connectTimeoutMS=${connectionTimeoutMS}`;

    if (username && password)
        connectionString = `${username}:${password}@${connectionString}`;

    if (replicaSet)
        connectionString = `${connectionString}&replicaSet=${replicaSet}`;

    return { uri: `mongodb://${connectionString}`, options };
};

module.exports.connect = callback => {
    const db = this.getSpec();

    // Promise Library
    mongoose.Promise = bluebird;
    // Establish Connection
    mongoose.connect(db.uri, db.options);

    // Mongoose Events
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected with MongoDB: ' + (new Date()).toISOString());
        callback();
    });

    // Event: Disconnected
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB Connection Closed: ' + (new Date()).toISOString())
    });

    // Event: Error
    mongoose.connection.on('error', (error) => {
        console.log('MongoDB Connection Error: ' + (new Date()).toISOString());
        console.log(error);
    });
};