const _ = require('lodash'),
    objectMapper = require('object-mapper'),
    bluebird = require('bluebird');

const store = require('./mappings/store'),
    user = require('./mappings/user'),
    camera = require('./mappings/camera');

const pg = require('./modules/pg'),
    database = require('.././api/core/modules/database');

const start = (config) => {
    let dbClient = null;
    return pg.getInstance()
        .then(client => {
            dbClient = client;

            let query = `SELECT ${Object.keys(config.query).join(',')} FROM ${config.table}`;
            return dbClient.query(query)
                .then(records => {
                    const docs = records.rows.map(row => objectMapper.merge(_.pick(row, Object.keys(config.query)), config.query));

                    const promises = [];
                    _.forEach(docs, record => {
                        promises.push(config.storage.deleteOne(record));
                    });

                    return bluebird.all(promises);
                })
                .then(records => {
                    console.log('Existing Records has been deleted');

                    const fields = Object.keys(config.mappings);
                    query = `SELECT ${fields.map(field => { return config.tableAlias ? config.tableAlias + '.' + field : field; }).join(',')}`;

                    if (config.join)
                        query += ',' + config.join.fields.join(',')

                    query += ` FROM ${config.table} ${config.tableAlias || ''}`

                    if (config.join)
                        query += ` ${config.join.query}`;

                    return dbClient.query(query);
                })
                .then(result => {
                    const records = [];
                    console.log("records 1=>", records.length);
                    _.forEach(result.rows, (record) => {
                        records.push(objectMapper.merge(record, _.merge({}, config.mappings, (config.join ? config.join.mappings : {}))));
                    });
                    console.log("records 2=>", records.length);
                    return config.storage.insertMany(records);
                })
                .then(result => {
                    console.log('Records has been inserted : ', result.length);
                    return 'done!!';
                });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => {
            if (dbClient && dbClient.end)
                dbClient.end();

            return null;
        });
};

database.connect(() => {
    const jobs = [camera, user, store];
    bluebird.each(jobs, (job) => {
        return start(job);
    })
        .done(() => {
            // camera processing
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
            camera.storage.aggregate(query)
                .then(stores => {
                    records = stores;
                    const promises = [];
                    _.forEach(stores, record => {
                        promises.push(store.storage.updateOne({ id: record._id }, { camera: record.cameras }));
                    });

                    return bluebird.all(promises);
                })
                .then(() => {
                    console.log('Camera details updated in Stores');
                    const stores = _.map(records, record => record._id);
                    const promises = [];
                    _.forEach(stores, id => {
                        promises.push(store.storage.getOne({ id }, { id: 1 }));
                    });
                    return bluebird.all(promises);
                })
                .then(records => {
                    const promises = [];
                    _.forEach(records, record => {
                        if (record)
                            promises.push(camera.storage.updateMany({ storeId: record.id }, { store: record._id }));
                    });

                    return bluebird.all(promises);
                })
                .then(() => {
                    console.log('Store details updated in camera');
                    return;
                })
                .done(() => {
                    process.exit(0);
                });
        });
})