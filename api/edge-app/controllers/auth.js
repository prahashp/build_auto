/**
 * @name api_edge_app_controllers_auth
 * @description Edge App Authentication
 */

// NPM Modules
const _ = require('lodash'),
    bluebird = require('bluebird'),

    // modules
    utils = require('../.././core/modules/utils'),

    // services
    storeService = require('../.././stores/services/stores'),
    tokenService = require('../../auth/services/tokens');

module.exports.pair = (req, res) => {
    const query = {
        appId: _.get(req.body, 'appId', null)
    };

    storeService.getOne(query)
        .then(record => {
            if (!record) {
                res.sendUnauthorized();
                return;
            }

            const authToken = {
                type: 'access-token',
                token: utils.getUuid(),
                refreshToken: utils.getUuid(),
                store: record._id
            };

            return bluebird.all([
                tokenService.insert(authToken),
                storeService.updateOne({ _id: record._id }, { paired: true, speedTest: req.body.speedTest, edgeAppToken:authToken.token })
            ])
                .spread((doc) => {
                    res.sendSuccess({
                        message: 'App paired successfully',
                        accessToken: authToken.token,
                        expiresAt: doc.createdAt
                    })
                });
        })
        .catch(error => {
            console.log(error);
            res.sendServerError(error);
        });
};
