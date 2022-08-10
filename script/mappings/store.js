const config = require('../.././config').ps_database;

const store = {
    table: config.database_name + '.' + config.database_schema + '.store',
    tableAlias: 's',
    query: {
        store_id: 'id'
    },
    mappings: {
        store_id: 'id',
        name: 'name',
        store_incharge: {
            key: 'spoc.name',
            transform: (value, objFrom, objTo) => {
                return value || 'NA';
            }
        },
        email: {
            key: 'spoc.email',
            transform: (value, objFrom, objTo) => {
                return value || 'NA';
            }
        },
        hibernate_start_time: 'hibernet.startTime',
        hibernate_end_time: 'hibernet.endTime',
        country_code: 'spoc.countryCode',
        phone_number: {
            key: 'spoc.contact',
            transform: (value, objFrom, objTo) => {
                return objFrom.country_code + '' + objFrom.phone_number;
            }
        },
        client_id:'client_id'
    },
    storage: require('../.././api/stores/services/stores'),
    join: {
        query: `inner join ${config.database_name + '.' + config.database_schema}.sdk_auth sa on sa.store_id = s.store_id`,
        fields: [
            'sa.app_id'
        ],
        mappings: {
            app_id: 'appId'
        }
    }
};

module.exports = store;
