/**
 * @name api:shops:controlles:client
 * @description Client Request Controllers
 */

// NPM Modules
const bluebird = require('bluebird'),
    mongoose = require('mongoose');

const productService = require('.././services/shop-products'),
    orderService = require('.././services/orders'),
    shelfsService = require('.././services/shop-shelfs'),
    shopUserService = require('.././services/shop-users'),
    videoTourService = require('.././services/shop-video-tour'),
    virtualTourService = require('.././services/shop-virtualtour'),
    unboxingService = require('.././services/shop-unboxing');

module.exports.getProducts = (req, res) => {
    let query = {
        shop: mongoose.Types.ObjectId(req.params.shopId),
        active: true
    };

    productService.find(query)
        .then(records => {
            res.sendSuccess(records);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getProduct = (req, res) => {
    const products = req.params.productId.split(',').map(product => {
        return mongoose.Types.ObjectId(product);
    });
    let query = {
        shop: mongoose.Types.ObjectId(req.params.shopId),
        _id: { $in: products }
    };

    productService.find(query)
        .then(records => {
            res.sendSuccess(records);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.createOrder = (req, res) => {
    orderService.create(req.body)
        .then(document => {
            return shopUserService.findOne({ _id: document.shop })
                .then(user => {
                    const response = document._doc;
                    response.shop = user;
                    res.sendSuccess(response);
                });
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getOrders = (req, res) => {
    const query = {
        shop: req.user._id
    };

    orderService.find(query, parseInt(req.query.limit || 20), parseInt(req.query.offset || 0))
        .then(documents => {
            res.sendSuccess(documents);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getShopInfo = (req, res) => {
    let query = {
        shop: mongoose.Types.ObjectId(req.params.shopId)
    };

    let shelfsquery = {
        shop: mongoose.Types.ObjectId(req.params.shopId),
        active: true
    };

    return new bluebird((resolve, reject) => {
        resolve(query);
    })
        .then(() => {
            return bluebird.all([
                productService.find(query),
                shelfsService.find(shelfsquery, {
                    products: 0,
                    items: 0,
                    createdAt: 0,
                    updatedAt: 0
                }),
                videoTourService.findOne(query),
                shopUserService.findOne({
                    _id: mongoose.Types.ObjectId(req.params.shopId)
                })
            ]);
        })
        .spread((products, shelves, virtualTour, shop) => {
            let response = {
                shop,
                virtualTour,
                shelves,
                productCatalogue: products.length ? true : false
            };

            res.sendSuccess(response);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getShelfInfo = (req, res) => {
    const shelfs = req.params.shelfId.split(',').map(shelf => {
        return mongoose.Types.ObjectId(shelf);
    });

    let query = {
        shop: mongoose.Types.ObjectId(req.params.shopId),
        active: true,
        _id: { $in: shelfs }
    };

    shelfsService.find(query)
        .then(records => {
            res.sendSuccess(records);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getShelfProductInfo = (req, res) => {
    let query = {
        shop: mongoose.Types.ObjectId(req.params.shopId),
        _id: mongoose.Types.ObjectId(req.params.shelfId)
    };
    const productId = req.params.productId.split(',');

    shelfsService.findOne(query)
        .then(record => {
            let product = record._doc.products.filter(item => {
                return (productId.indexOf(item._id.toString()) > -1);
            });
            res.sendSuccess(product);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.updateOrders = (req, res) => {
    const query = {
        _id: mongoose.Types.ObjectId(req.params.orderId)
    };

    const input = req.body;
    input.updatedAt = new Date();

    orderService.update(query, input)
        .then(documents => {
            res.sendSuccess('The order has been updated');
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getOrderById = (req, res) => {
    const query = {
        _id: mongoose.Types.ObjectId(req.params.orderId)
    };

    orderService.findOne(query)
        .then(documents => {
            res.sendSuccess(documents);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getUnboxingVideos = (req, res) => {
    const videos = req.params.videoId.split(',').map(video => {
        return mongoose.Types.ObjectId(video);
    });
    let query = {
        shop: mongoose.Types.ObjectId(req.params.shopId),
        _id: { $in: videos }
    };

    unboxingService.find(query)
        .then(records => {
            res.sendSuccess(records);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getUnboxingVideosList = (req, res) => {
    let query = {
        shop: mongoose.Types.ObjectId(req.params.shopId),
        active: true
    };

    unboxingService.find(query)
        .then(records => {
            res.sendSuccess(records);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};

module.exports.getvideotourVideosList = (req, res) => {
    let query = {
        shop: mongoose.Types.ObjectId(req.params.shopId),
        active: true
    };

    virtualTourService.find(query)
        .then(records => {
            res.sendSuccess(records);
        })
        .catch(error => {
            res.sendServerError(error);
        });
};