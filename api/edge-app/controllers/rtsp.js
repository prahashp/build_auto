/**
 * @name api_edge_app_controllers_rtgs
 */

// NPM Modules
const _ = require('lodash'),
    bluebird = require('bluebird'),

    // services
    cameraService = require('../../camera/services/camera');

module.exports.get = (req, res) => {
    const query = {
        store: req.store._id
    };

    return cameraService.get(query)
        .then((records) => {
            const response = [];
            _.forEach(records, record => {
                const data = {};
                data.storeId = req.store.id;
                data.cameraId = record.no;
                data.cameraName = record.name;
                data.RTSP = record.RTSP;

                response.push(data);
            });

            res.sendSuccess(response);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getPreview = (req, res) => {
    const query = {
        store: req.store._id
    };

    return cameraService.get(query)
        .then((records) => {
            const response = [];
            _.forEach(records, record => {
                const data = {};
                data.storeId = req.store.id;
                data.cameraId = record.no;
                data.cameraName = record.name;
                data.RTSP = record.RTSP;
                data.thumbnailImage = record.thumbnailImage;

                response.push(data);
            });

            res.sendSuccess(response);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.postPreview = (req, res) => {
    if (!_.isArray(req.body)) {
        res.sendBadRequest('Please provide valid input');
        return;
    }

    const promises = [];
    _.forEach(req.body, (record) => {
        const doc = {
            name: record.cameraName,
            RTSP: record.RTSP,
            thumbnailImage: record.thumbnailImage
        };
        const query = {
            store: req.store._id,
            no: record.cameraId
        };
        promises.push(cameraService.updateOne(query, doc));
    });

    return bluebird.all(promises)
        .then(() => {
            res.sendSuccess('The camera details has been updated!');
        })
        .catch(error => {
            res.sendServerError(error);
        });
};
