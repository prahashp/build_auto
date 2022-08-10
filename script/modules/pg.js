const { Client } = require('pg'),
    bluebird = require('bluebird');

const config = require('../.././config').ps_database;

const db = {
    getInstance: () => {
        return new bluebird((resolve, reject) => {
            const client = new Client({
                host: config.database_host,
                port: config.database_port,
                user: config.database_username,
                password: config.database_password,
                database: config.database_name
            });

            client.connect()
                .then(() => {
                    resolve(client);                    
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

module.exports = db;
