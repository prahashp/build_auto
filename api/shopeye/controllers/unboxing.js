/**
 * @name api:shops:controllers:products
 * @description Products Controller
 */

const ShopUnboxing = require('../services/shop-unboxing'),
    ShopShares = require('../services/shop-shares'),
    AWSconfig = require('../../../config').shopeye_bucket.aws,
    AWS = require('aws-sdk');

module.exports.upload = async (req, res) => {
    res.sendSuccess({ path: req.file.location, key: req.file.key });
};

module.exports.new = async (req, res) => {
    if(req.body.description == undefined || req.body.description == null){
        req.body.description = '';
    }
    let data = {
        video: req.body.video.path,
        key: req.body.video.key,
        shop: req.user._id,
        name: req.body.name,
        description: req.body.description
    }
    const record = await ShopUnboxing.create(data);
    res.sendSuccess(record);
};

module.exports.list = async (req, res) => {
    let response = {
        count: await ShopUnboxing.count({ shop: req.user._id, active: true  }),
        products: await ShopUnboxing.find({ shop: req.user._id, active: true  })
    };
    res.sendSuccess(response);
};

module.exports.fetch = async (req, res) => {
    let response = await ShopUnboxing.findOne({ _id: req.params.id, shop: req.user._id, active: true });
    res.sendSuccess(response);
};

module.exports.updateVideo = async (req, res) => {
    const record = {
        video: req.file.location,
        key: req.file.key
    }
    const query = { _id: req.params.id, shop: req.user._id };
    record.updatedAt = new Date();

    const s3Object = await ShopUnboxing.findOne(query);
    AWS.config.update(AWSconfig.auth);
    const s3 = new AWS.S3({
        accessKeyId: AWSconfig.auth.accessKey,
        secretAccessKey: AWSconfig.auth.secretAccessKey,
        Bucket: AWSconfig.s3.bucketName
    });
    
    s3.deleteObject({ Bucket: AWSconfig.s3.bucketName, Key: s3Object.key }, async (err, data) => {
        await ShopUnboxing.updateOne(query, record);
        const updatedObject = await ShopUnboxing.findOne(query);
        res.sendSuccess(updatedObject);
    });
};

module.exports.update = async (req, res) => {
    const query = { _id: req.params.id, shop: req.user._id };
    req.body.updatedAt = new Date();

    await ShopUnboxing.updateOne(query, req.body);
    res.sendSuccess({});
};

module.exports.delete = async (req, res) => {
    const query = { _id: req.params.id, shop: req.user._id };

    // const s3Object = await ShopUnboxing.findOne(query);
    // AWS.config.update(AWSconfig.auth);
    // const s3 = new AWS.S3({
    //     accessKeyId: AWSconfig.auth.accessKey,
    //     secretAccessKey: AWSconfig.auth.secretAccessKey,
    //     Bucket: AWSconfig.s3.bucketName
    // });
    
    // s3.deleteObject({ Bucket: AWSconfig.s3.bucketName, Key: s3Object.key }, async (err, data) => {
        await ShopUnboxing.updateOne(query, {active: false});
        // await ShopShares.deleteOne({shop: req.user._id, unboxingVideoId: req.params.id});
        res.sendSuccess('The video has been removed!');
    // });
    
};
