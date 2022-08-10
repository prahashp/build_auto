const mongoose = require('mongoose');

const config = require('../.././config').ps_database;

const stores = require('../.././api/stores/services/stores');

const camera = {
    table: config.database_name + '.' + config.database_schema + '.camera',
    query: {
        ip: 'ip'
    },
    mappings: {
        ip: 'ip',
        username: 'username',
        password: 'password',
        rtsp_url: 'RTSP',
        stream_id: 'streamName',
        camera_number: 'no',
        store_id: 'storeId',
        client_id: 'client_id',
        status: {
            key: 'status',
            transform: (value) => {
                return (value === 1) ? true : false;
            }
        },
        is_active: {
            key: 'isUp',
            transform: (value) => {
                return (value === 1) ? true : false;
            }
        }
    },
    storage: require('../.././api/camera/services/camera')
};

module.exports = camera;
