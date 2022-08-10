/**
 * @name api_camera_acl
 * @description MigrationAcl
 */

const _ = require('lodash'),
    bluebird = require('bluebird'),

    storage = require('.././services/migration');

module.exports.isAllowed = (req, res, next) => {
    const apiKey = _.get(req.headers, 'x-api-key', '');
    const userIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0];

    bluebird.all([
        storage.getIp({ ip: userIp }),
        storage.getApiKey({ apiKey: apiKey })
    ])
        .spread((ipDoc, apiKeyDoc) => {
            if (apiKeyDoc && ipDoc) {
                next();
                return;
            }

            res.sendUnauthorized();
            return;
        })
        .catch(error => {
            res.sendServerError(error);
        });
};
