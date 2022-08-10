/**
 * @name api_alerts_controllers
 * @description Alerts Controller
 */

// services
const storage = require('.././services/alerts'),

    // NPM Modules
    bluebird = require('bluebird');

module.exports.insert = (req, res) => {
    const record = req.body;
    record.user = req.user._id;
    record.brandId = req.user.brandId;
    return storage.insert(record)
        .then(data => {
            return res.status(201)
                .json({
                    code: 201,
                    status: 'success',
                    data
                });
        })
        .catch(error => {
            console.log("error =>", error);
            return res.sendServerError(error);
        })
};

module.exports.get = (req, res) => { 
    let query = {};

    if(req.user.brandId && req.user.brandId !='' ){
        query.brandId = req.user.brandId;
    }

    if(req.query.brandId && req.query.brandId !='' ){
        query.brandId = req.query.brandId;
    }

    if(req.user.role == "superadmin" || req.user.role == "admin" || req.user.role == "user"){
        query.adminNotification = true;
    }else if(req.user.role == "storesuperadmin" || req.user.role == "storeadmin" || req.user.role == "storeuser"){
        query.clientNotification = true;
    }
    
    const fields = { _id: 0 };

    if (req.query.keyword)
        query.$or = [
            { name: RegExp(req.query.keyword, 'i') },
            { description: RegExp(req.query.keyword, 'i') }
        ];

    let limit = req.query.limit || 10;
    let skip = req.query.limit * req.query.offset || 0;

    return bluebird.all([
        storage.find(query, fields, skip, limit),
        storage.getCount(query),
    ])
        .spread((data, count) => {
            res.status(200)
                .json({
                    code: 200,
                    status: 'success',
                    count,
                    data
                });
        })
        .catch(error => {
            console.log(error);
            res.sendServerError(error);
        })
};
