const config = require('../.././config').ps_database;

const user = {
    table: config.database_name + '.' + config.database_schema + '.users',
    query: {
        email: 'email'
    },
    mappings: {
        first_name: {
            key: 'name',
            transform: (value, objFrom, objTo) => {
                let name = '';
                if (objFrom.first_name || objFrom.last_name)
                    name = objFrom.first_name || '' + objFrom.last_name || '';

                return name;
            }
        },
        email: 'email',
        password: {
            key: 'password',
            transform: () => {
                return '5dqFKAJj29PsV6P+kL+3Dw=='
            }
        },
        country_code: {
            key: 'phone',
            transform: (value) => {
                return value || `NA`;
            }
        },
        status: {
            key: 'active',
            transform: (value) => {
                return (value === 1) ? true : false;
            }
        },
        client_id: 'client_id'
    },
    storage: require('../.././api/users/services/users')
};

module.exports = user;
