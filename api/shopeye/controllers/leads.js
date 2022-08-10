/**
 * @name api:shops:controlles:leads
 * @description Leads Controllers
 */

// NPM Modules
const { resolve } = require('bluebird');
const mongoose = require('mongoose'),
    bluebird = require('bluebird'),
    _ = require('lodash');

// services
const leads = require('.././services/leads'),
    orders = require('.././services/orders');

module.exports.getCustomerReports = (req, res) => {
    return new bluebird((resolve) => {
        let query = {
            shop: mongoose.Types.ObjectId(req.user._id)
        };
        resolve(query);
    })
        .then(query => {
            return bluebird.all([
                leads.getCustomersCount(query),
                leads.getOrdersCount(query),
                leads.getOrdersCount(_.merge({}, query, { purchased: { $exists: true } })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'callback' })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'callback', purchased: true })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'storepickup' })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'storepickup', purchased: true })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'buynow' })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'buynow', purchased: true }))
            ]);
        })
        .spread((customers, reqCount, resCount, callbackReq, callbackRes, storePickupkReq, storePickupRes, buyNowReq, buyNowRes) => {
            const results = {
                customers: customers.length,
                requests: reqCount,
                responses: resCount,
                callback: {
                    requests: callbackReq,
                    responses: callbackRes
                },
                storePickup: {
                    requests: storePickupkReq,
                    responses: storePickupRes
                },
                buyNow: {
                    requests: buyNowReq,
                    responses: buyNowRes
                }
            };

            res.sendSuccess(results);
        })
        .catch(error => {
            console.log(error);
            res.sendServerError(error);
        });
};

module.exports.filteredReports = async (req, res) => {
    try {
        let query = { shop: mongoose.Types.ObjectId(req.user._id) };
        let storeQuery = { shop: mongoose.Types.ObjectId(req.user._id) };
        let buyQuery = { shop: mongoose.Types.ObjectId(req.user._id) };
        let callbackRes = [];
        let pickupRes = [];
        let buynowRes = [];
        // Callback filter
        if (req.body.filterTypes.includes('callback_req') && req.body.filterTypes.includes('callback_res')) {
            query.orderType = 'callback';
        } else if (req.body.filterTypes.includes('callback_res') && !req.body.filterTypes.includes('callback_req')) {
            query.orderType = 'callback';
            query.purchased = { $exists: true }
        } else if (req.body.filterTypes.includes('callback_req')) {
            query.orderType = 'callback';
        }
        // Get callback data
        if (req.body.filterTypes.includes('callback_req') || req.body.filterTypes.includes('callback_res')) {
            callbackRes = await orders.find(query, { id: 1 }).catch(error => { throw new Error(error); })
        }
        // Storepickup filter
        if (req.body.filterTypes.includes('pickup_req') && req.body.filterTypes.includes('pickup_res')) {
            storeQuery.orderType = 'storepickup';
        } else if (req.body.filterTypes.includes('pickup_res') && !req.body.filterTypes.includes('pickup_req')) {
            storeQuery.orderType = 'storepickup';
            storeQuery.purchased = { $exists: true }
        } else if (req.body.filterTypes.includes('pickup_req')) {
            storeQuery.orderType = 'storepickup';
        }
        // Get storepickup data
        if (req.body.filterTypes.includes('pickup_req') || req.body.filterTypes.includes('pickup_res')) {
            pickupRes = await orders.find(storeQuery, { id: 1 }).catch(error => { throw new Error(error); })
        }

        // buynow filter
        if (req.body.filterTypes.includes('buy_req') && req.body.filterTypes.includes('buy_res')) {
            buyQuery.orderType = 'buynow';
        } else if (req.body.filterTypes.includes('buy_res') && !req.body.filterTypes.includes('buy_req')) {
            buyQuery.orderType = 'buynow';
            buyQuery.purchased = { $exists: true }
        } else if (req.body.filterTypes.includes('buy_req')) {
            buyQuery.orderType = 'buynow';
        }
        // Get buynow data
        if (req.body.filterTypes.includes('buy_req') || req.body.filterTypes.includes('buy_res')) {
            buynowRes = await orders.find(buyQuery, { id: 1 }).catch(error => { throw new Error(error); })
        }

        let results = callbackRes.concat(pickupRes, buynowRes);
        let finalIds = [];
        for(let index of results){
            let ids = index['products'].map(a => a._id);
            finalIds = [...finalIds, ...ids]
        }

        res.sendSuccess(finalIds);

    } catch (error) {
        console.log(error);
        res.sendServerError(error);
    };
};

module.exports.getProductAnalytics = (req, res) => {
    return new bluebird((resolve) => {
        let query = {
            shop: mongoose.Types.ObjectId(req.user._id),
            'products._id': req.params.id
        };
        resolve(query);
    })
        .then(query => {
            return bluebird.all([
                leads.getCustomersCount(query),
                orders.find(_.merge({}, query, { orderType: { $ne: 'newdata' } }), 0, 0),
                // orders.find(_.merge({}, query, { orderType: { $ne: 'buynow' } }), 0, 0),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'callback' })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'callback', purchased: true })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'storepickup' })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'storepickup', purchased: true })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'buynow' })),
                leads.getOrdersCount(_.merge({}, query, { orderType: 'buynow', purchased: true }))
            ]);
        })
        .spread((customers, ordersHistory, callbackReq, callbackRes, storePickupkReq, storePickupRes, buyNowReq, buyNowRes) => {
            const results = {
                customers: customers.length,
                orders: ordersHistory,
                callback: {
                    requests: callbackReq,
                    responses: callbackRes
                },
                storePickup: {
                    requests: storePickupkReq,
                    responses: storePickupRes
                },
                buyNow: {
                    requests: buyNowReq,
                    responses: buyNowRes
                }
            };

            res.sendSuccess(results);
        })
        .catch(error => {
            console.log(error);
            res.sendServerError(error);
        });
};
