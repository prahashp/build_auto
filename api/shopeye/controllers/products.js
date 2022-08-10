/**
 * @name api:shops:controllers:products
 * @description Products Controller
 */

const ShopProducts = require('../services/shop-products');
    // ShopShares = require('../services/shop-shares'),
    // AWSconfig = require('../../../config').aws,
    // AWS = require('aws-sdk');

module.exports.upload = async (req, res) => {
    res.sendSuccess({ path: req.file.location, key: req.file.key });
};

module.exports.new = async (req, res) => {
    let data = {
        shop: req.user._id
    }
    // console.log(req.body);
    let isExists = await ShopProducts.findOne({shop: req.user._id, name: req.body.name});
    if(isExists){
        res.sendBadRequest({error: 'Product name exists already'});
    }else{
        const record = await ShopProducts.create({ ...req.body, ...data });
        res.sendSuccess(record);
    }
};

module.exports.list = async (req, res) => {
    let response = {
        count: await ShopProducts.count({ shop: req.user._id, active: true }),
        products: await ShopProducts.find({ shop: req.user._id, active: true })
    };
    res.sendSuccess(response);
};

module.exports.fetch = async (req, res) => {
    let response = await ShopProducts.findOne({ _id: req.params.id, shop: req.user._id, active: true });
    res.sendSuccess(response);
};

module.exports.update = async (req, res) => {
    const record = req.body;
    const query = { _id: req.params.id, shop: req.user._id };
    record.updatedAt = new Date();

    await ShopProducts.updateOne(query, record);
    res.sendSuccess('The product has been updated!');
};

module.exports.delete = async (req, res) => {
    const query = { _id: req.params.id, shop: req.user._id };

    // const s3Object = await ShopProducts.findOne(query);
    // AWS.config.update(AWSconfig.auth);
    // const s3 = new AWS.S3({
    //     accessKeyId: AWSconfig.auth.accessKey,
    //     secretAccessKey: AWSconfig.auth.secretAccessKey,
    //     Bucket: AWSconfig.s3.bucketName
    // });

    // s3.deleteObject({ Bucket: AWSconfig.s3.bucketName, Key: s3Object.key }, async (err, data) => {
        await ShopProducts.updateOne(query, {active: false});
        // await ShopShares.deleteOne({shop: req.user._id, productId: req.params.id});
        res.sendSuccess('The product has been removed!');
    // });
};
