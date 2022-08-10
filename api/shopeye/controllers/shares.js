/**
 * @name api:shops:controllers:shares
 * @description Shares Controller
 */

const ShopShares = require('.././services/shop-shares');
const ShopShelves = require('.././services/shop-shelfs');

module.exports.new = async (req, res) => {
    req.body.shop = req.user._id;
    if (req.body.multipleData != undefined) {
        let category = '';
        let shelfData = '';
        switch (req.body.contentType) {
            case 'product':
                category = 'productId';
                break;
            case 'virtualtour':
                category = 'virtualTourId';
                break;
            case 'shelf':
                category = 'shelfId';
                break;
            case 'unboxing':
                category = 'unboxingVideoId';
                break;
            default:
                category = 'productId';
                break;
        }

        if (req.body.contentType == 'shelfproduct') {
            for (let index of req.body.multipleData) {
                await ShopShares.create({ shop: req.body.shop, contentType: req.body.contentType, messageId: req.body.messageId, shelfId: req.body.shelfId, [category]: index });
            }
        } else {
            for (let index of req.body.multipleData) {
                await ShopShares.create({ shop: req.body.shop, contentType: req.body.contentType, messageId: req.body.messageId, [category]: index });
            }
        }
    } else {
        await ShopShares.create(req.body);
    }
    res.sendSuccess({ success: true });
};

module.exports.list = async (req, res) => {
    let response = await ShopShares.find({ shop: req.user._id });
    res.sendSuccess(response);
};

module.exports.count = async (req, res) => {
    try {
        let groupCondQuery = { _id: "$contentType", shares: { $sum: 1 } };
        let condition = [{
            $match: { "shop": req.user._id }
        }, {
            $group: groupCondQuery
        }];
        let countsByCategory = await ShopShares.aggregate(condition);
        let categoryCount = { product: 0, shelf: 0, virtualtour: 0, unboxing: 0, shelfproduct: 0 };
        for (let index of countsByCategory) {
            categoryCount[index._id] = index.shares;
        }
        let totalCount = await ShopShares.find({ "shop": req.user._id }, { _id: 1, contentType: 1 });
        // Percentages
        let percentages = (req.params.isPercentageRequired != 'false') ? await getPercentages(req.user._id, groupCondQuery) : {};

        res.sendSuccess({ categoryCount: categoryCount, total: totalCount.length, percentages: percentages });
    } catch (err) {
        res.sendBadRequest({error: err.toString()});
    }
};

module.exports.fetch = async (req, res) => {
    let response = await ShopShares.findOne({ _id: req.params.id, shop: req.user._id });
    res.sendSuccess(response);
};

module.exports.aggregate = async (req, res) => {
    let response = await ShopShares.aggregate(data);
    res.sendSuccess(response);
}

module.exports.sortCategoryByShares = async (req, res) => {
    try {
        let category = req.params.category;
        category = category.split(',');
        let skip = parseInt(req.params.skip);
        let response = [];
        if(category.includes('product')){
            let result = await sortByFilters(req.user._id, 'products', 'product', "$productId");
            response = [...response, ...result];
        }

        if(category.includes('shelf')){
            let result = await sortByFilters(req.user._id, 'shelves', 'shelf', "$shelfId");
            response = [...response, ...result];
        }

        if(category.includes('virtual-tour')){
            let result =  await sortByFilters(req.user._id, 'virtualtours', 'virtualtour', "$virtualTourId");
            response = [...response, ...result];
        }

        if(category.includes('unboxing')){
            let result = await sortByFilters(req.user._id, 'unboxings', 'unboxing', "$unboxingVideoId");      
            response = [...response, ...result];
        }

        response = response.sort((a, b) => parseInt(b.count) - parseInt(a.count));
        if(skip > 0){
            response = response.slice(skip, 10 + (skip - 1));
        }else{
            response = response.slice(0, 10);
        }

        res.sendSuccess(response);
    } catch (error) {
        res.sendBadRequest({error: error.toString()});
    }
}

function sortByFilters(shop, collection, contentType, sortByField) {
    return new Promise(async (resolve, reject) => {
        let projectCond = { "count": "$count", "name": "$info.name", "active": "$info.active", "type": { $literal: contentType } };
        if (contentType == 'shelf') {
            projectCond["productsCount"] = { $size:"$info.products" }
        }
        let condition = [
            { $match: { shop: shop, contentType: contentType } },
            // { $sortByCount: sortByField },
            { "$group": { _id: sortByField, count: { $sum: 1 } } },
            {
                $lookup:
                {
                    from: collection,
                    let: { product: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$$product", "$_id"] } } }
                    ],
                    as: "info"
                }
            },
            { $unwind: "$info" },
            { $project: projectCond }
        ];

        let products = await ShopShares.aggregate(condition).catch((error) => { reject(error) });

        if (contentType == 'product') {
            let condition = [
                { $match: { shop: shop, contentType: "shelfproduct" } },
                { $project: { "shelfId": 1, "productId": 1, "type": { $literal: "product" } } },
                { "$group": { _id: { product: "$productId", shelf: "$shelfId", type: "$type" }, count: { $sum: 1 } } }
            ];
            let shelfProducts = await ShopShares.aggregate(condition).catch((error) => { reject(error) });

            for (let index of shelfProducts) {

                let productname = await ShopShelves.find({ _id: index._id.shelf, "products._id": index._id.product }, { "products": { $elemMatch: { _id: index._id.product } } }).catch((error) => { reject(error) })

                if(productname.length){
                    products.push({_id: index._id.product, name: productname[0].products[0].name, shelfId: productname[0]._id, active: productname[0].products[0].active, count: index.count, type: index._id.type})
                }
            }
        }

        resolve(products)
    });
}

function getPercentages(user, groupCondQuery) {
    return new Promise(async (resolve, reject) => {
        let weekTime = 7 * 60 * 60 * 24 * 1000;

        let previousCond = [{
            $match: {
                "shop": user, createdAt: {
                    $gte: new Date(new Date() - 2 * weekTime),
                    $lte: new Date(new Date() - weekTime)
                }
            }
        }, {
            $group: groupCondQuery
        }];

        let lastCond = [{
            $match: {
                "shop": user, createdAt: {
                    $gte: new Date(new Date() - weekTime)
                }
            }
        }, {
            $group: groupCondQuery
        }];
        let previousWeekData = await ShopShares.aggregate(previousCond).catch((error) => { console.log(error); reject(error); });
        let lastWeekData = await ShopShares.aggregate(lastCond).catch((error) => { console.log(error); reject(error); });

        let previousCount = { product: 0, shelf: 0, virtualtour: 0, unboxing: 0, shelfproduct: 0 };
        let lastCount = { product: 0, shelf: 0, virtualtour: 0, unboxing: 0, shelfproduct: 0 };

        for (let index of previousWeekData) {
            previousCount[index._id] = index.shares;
        }
        for (let index of lastWeekData) {
            lastCount[index._id] = index.shares;
        }

        let newObj = Object.keys(lastCount).reduce((a, k) => {
            a[k] = lastCount[k] - previousCount[k];
            return a;
        }, {});

        resolve(newObj)
    });
}


