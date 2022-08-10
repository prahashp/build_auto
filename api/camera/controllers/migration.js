const _ = require('lodash'),
    objectMapper = require('object-mapper'),
    bluebird = require('bluebird');

const pg = require('../../.././script/modules/pg');

const storeService = require('../.././stores/services/stores');

module.exports.cameraEtl = (req, res) => {
    const config = require('../../.././script/mappings/camera');
    let dbClient = null;
    return pg.getInstance()
        .then(client => {
            dbClient = client;

            const fields = Object.keys(config.mappings);
            let query = `SELECT ${fields.map(field => { return config.tableAlias ? config.tableAlias + '.' + field : field; }).join(',')}`;

            if (config.join)
                query += ',' + config.join.fields.join(',')

            query += ` FROM ${config.table} ${config.tableAlias || ''}`

            if (config.join)
                query += ` ${config.join.query}`;

            // query += ' LIMIT 2';

            return dbClient.query(query);
        })
        .then(result => {
            console.log('Camera details fetched from DB!!!');
            const promises = [];
            _.forEach(result.rows, (record) => {
                let query = {};
                _.forEach(Object.keys(config.query), key => {
                    query[config.query[key]] = record[key];
                });

                promises.push(config.storage.upsert(query, objectMapper.merge(record, _.merge({}, config.mappings, (config.join ? config.join.mappings : {})))));
            });

            return bluebird.all(promises);
        })
        .then(result => {
            console.log('Camera details has been upserted!!!');
            const query = [
                {
                    $group: {
                        _id: '$storeId',
                        cameras: {
                            $addToSet: '$_id'
                        }
                    }
                }
            ];

            let records = [];
            return config.storage.aggregate(query)
                .then(stores => {
                    records = stores;
                    const promises = [];
                    _.forEach(stores, record => {
                        promises.push(storeService.updateOne({ id: record._id }, { camera: record.cameras }));
                    });

                    return bluebird.all(promises);
                })
                .then(() => {
                    console.log('Camera details updated in Stores!!!');
                    const stores = _.map(records, record => record._id);
                    const promises = [];
                    _.forEach(stores, id => {
                        promises.push(storeService.getOne({ id }, { id: 1 }));
                    });
                    return bluebird.all(promises);
                })
                .then(records => {
                    const promises = [];
                    _.forEach(records, record => {
                        if (record)
                            promises.push(config.storage.updateMany({ storeId: record.id }, { store: record._id }));
                    });

                    return bluebird.all(promises);
                })
                .then(() => {
                    console.log('Store details updated in camera!!!');
                    return;
                })
        })
        .catch(error => {
            console.log(error);
            return error;
        })
        .then((result) => {
            if (dbClient && dbClient.end)
                dbClient.end();

            res.status(200)
                .json({
                    message: 'camera migration script executed!!!',
                    error: result
                });

            return null;
        });
};

module.exports.storeEtl = (req, res) => {
    const config = require('../../.././script/mappings/store');
    let dbClient = null;
    return pg.getInstance()
        .then(client => {
            dbClient = client;

            const fields = Object.keys(config.mappings);
            let query = `SELECT ${fields.map(field => { return config.tableAlias ? config.tableAlias + '.' + field : field; }).join(',')}`;

            if (config.join)
                query += ',' + config.join.fields.join(',')

            query += ` FROM ${config.table} ${config.tableAlias || ''}`

            if (config.join)
                query += ` ${config.join.query}`;

            // query += ' LIMIT 2';

            return dbClient.query(query);
        })
        .then(result => {
            console.log('Store details fetched from DB!!!');
            const promises = [];
            _.forEach(result.rows, (record) => {
                let query = {};
                _.forEach(Object.keys(config.query), key => {
                    query[config.query[key]] = record[key];
                });

                promises.push(config.storage.upsert(query, objectMapper.merge(record, _.merge({}, config.mappings, (config.join ? config.join.mappings : {})))));
            });

            return bluebird.all(promises);
        })
        .then(result => {
            console.log('Store details has been updated in MongoDB!!!');
            return null;
        })
        .catch(error => {
            console.log(error);
            return error;
        })
        .then((result) => {
            if (dbClient && dbClient.end)
                dbClient.end();

            res.status(200)
                .json({
                    message: 'stores migration script executed!!!',
                    error: result
                });

            return null;
        });
};

module.exports.usersEtl = (req, res) => {
    const config = require('../../.././script/mappings/user');
    let dbClient = null;
    return pg.getInstance()
        .then(client => {
            dbClient = client;

            const fields = Object.keys(config.mappings);
            let query = `SELECT ${fields.map(field => { return config.tableAlias ? config.tableAlias + '.' + field : field; }).join(',')}`;

            if (config.join)
                query += ',' + config.join.fields.join(',')

            query += ` FROM ${config.table} ${config.tableAlias || ''}`

            if (config.join)
                query += ` ${config.join.query}`;

            // query += ' LIMIT 2';

            return dbClient.query(query);
        })
        .then(result => {
            console.log('User details fetched from DB!!!');
            const promises = [];
            _.forEach(result.rows, (record) => {
                let query = {};
                _.forEach(Object.keys(config.query), key => {
                    query[config.query[key]] = record[key];
                });

                promises.push(config.storage.upsert(query, objectMapper.merge(record, _.merge({}, config.mappings, (config.join ? config.join.mappings : {})))));
            });

            return bluebird.all(promises);
        })
        .then(result => {
            console.log('User details has been updated in MongoDB!!!');
            return null;
        })
        .catch(error => {
            console.log(error);
            return error;
        })
        .then((result) => {
            if (dbClient && dbClient.end)
                dbClient.end();

            res.status(200)
                .json({
                    message: 'users migration script executed!!!',
                    error: result
                });

            return null;
        });
};