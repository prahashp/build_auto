/**
 * @name api:shops:controllers:shelfs
 * @description Shelfs Controller
 */

const ShopRacks = require('.././services/shop-shelfs'),
    ShopShares = require('../services/shop-shares'),
    // AWSconfig = require('../../../config').aws,
    // AWS = require('aws-sdk'),
    shelfAPIClass = require('../modules/tango/shelf-api'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

module.exports.upload = async (req, res) => {
    try {
        let shelfAPI = new shelfAPIClass();
        let alignRes = await shelfAPI.align(req.file.location).catch((err) => { throw new Error(err) });
        let predictRes = await shelfAPI.predict(alignRes.image_s3_url).catch((err) => { throw new Error(err) });

        let products = [];
        if(predictRes.detections && predictRes.detections.length){
            products = predictRes.detections;
        }

        res.sendSuccess({ source: { key: req.file.key, coverImage: req.file.location }, products: products });
    } catch (err) {
        res.sendBadRequest({ error: err.toString() });
    }
};

module.exports.uploadCustomImage = async (req, res) => {
    try {
        res.sendSuccess({ path: req.file.location});
    } catch (err) {
        res.sendBadRequest({error: err.toString()});
    }
};

module.exports.new = async (req, res) => {
    req.body.shop = req.user._id;
    let insertedData = await ShopRacks.create(req.body);
    res.sendSuccess(insertedData);
};

module.exports.list = async (req, res) => {
    let response = await ShopRacks.find({ shop: req.user._id, active: true });
    res.sendSuccess(response);
};

module.exports.count = async (req, res) => {
    let response = await ShopRacks.find({ shop: req.user._id, active: true });
    res.sendSuccess({ count: response.length });
};

module.exports.fetch = async (req, res) => {
    let response = await ShopRacks.findOne({ _id: req.params.id, shop: req.user._id, active: true });
    res.sendSuccess(response);
};

module.exports.update = async (req, res) => {
    let response = await ShopRacks.updateOne({ _id: req.params.id }, { name: req.body.name, description: req.body.description, category: req.body.category });
    res.sendSuccess(response);
}

module.exports.delete = async (req, res) => {
    const query = { _id: ObjectId(req.params.id), shop: ObjectId(req.user._id) };

    // const s3Object = await ShopRacks.findOne(query);
    // AWS.config.update(AWSconfig.auth);
    // const s3 = new AWS.S3({
    //     accessKeyId: AWSconfig.auth.accessKey,
    //     secretAccessKey: AWSconfig.auth.secretAccessKey,
    //     Bucket: AWSconfig.s3.bucketName
    // });

    // if(s3Object){
    // s3.deleteObject({ Bucket: AWSconfig.s3.bucketName, Key: s3Object.source.key }, async (err, data) => {
    // for(let index of s3Object.products){
    //     s3.deleteObject({ Bucket: AWSconfig.s3.bucketName, Key: index.coverImage });
    //     for(let innerIndex of index.customMedia){
    //         s3.deleteObject({ Bucket: AWSconfig.s3.bucketName, Key: innerIndex });
    //     }
    // }
    await ShopRacks.updateOne(query, { active: false });
    // await ShopShares.deleteMany({shop: req.user._id, shelfId: req.params.id});
    res.sendSuccess('The shelf has been removed!');
    // });
    // }

};