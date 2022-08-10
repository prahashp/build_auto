/**
 * @name api:shops:controllers:products
 * @description Products Controller
 */

const ShopVideoTour = require('../services/shop-video-tour'),
    AWSconfig = require('../../../config').shopeye_bucket.aws,
    AWS = require('aws-sdk');

module.exports.upload = async (req, res) => {
    res.sendSuccess({ path: req.file.location, key: req.file.key });
};

module.exports.new = async (req, res) => {
    let data = {
        video: req.body.video.path,
        key: req.body.video.key,
        shop: req.user._id,
        name: req.body.name,
        description: req.body.description
    }
    const record = await ShopVideoTour.create(data);
    res.sendSuccess({
        count: 1,
        products: [record]
    })
};

module.exports.list = async (req, res) => {
    let response = {
        count: await ShopVideoTour.count({ shop: req.user._id, active: true }),
        products: await ShopVideoTour.find({ shop: req.user._id, active: true })
    };
    res.sendSuccess(response);
};

module.exports.fetch = async (req, res) => {
    let response = await ShopVideoTour.findOne({ _id: req.params.id, shop: req.user._id, active: true });
    res.sendSuccess(response);
};

module.exports.updateVideo = async (req, res) => {
    const record = {
        video: req.file.location,
        key: req.file.key
    }
    const query = { _id: req.params.id, shop: req.user._id };
    record.updatedAt = new Date();

    const s3Object = await ShopVideoTour.findOne(query);
    AWS.config.update(AWSconfig.auth);
    const s3 = new AWS.S3({
        accessKeyId: AWSconfig.auth.accessKey,
        secretAccessKey: AWSconfig.auth.secretAccessKey,
        Bucket: AWSconfig.s3.bucketName
    });

    s3.deleteObject({ Bucket: AWSconfig.s3.bucketName, Key: s3Object.key }, async (err, data) => {
        await ShopVideoTour.updateOne(query, record);
        const updatedObject = await ShopVideoTour.findOne(query);
        res.sendSuccess(updatedObject);
    });
};

module.exports.update = async (req, res) => {
    const query = { _id: req.params.id, shop: req.user._id };
    req.body.updatedAt = new Date();

    await ShopVideoTour.updateOne(query, req.body);
    res.sendSuccess({});
};

module.exports.delete = async (req, res) => {
    const query = { _id: req.params.id, shop: req.user._id };

    // const s3Object = await ShopVideoTour.findOne(query);
    // AWS.config.update(AWSconfig.auth);
    // const s3 = new AWS.S3({
    //     accessKeyId: AWSconfig.auth.accessKey,
    //     secretAccessKey: AWSconfig.auth.secretAccessKey,
    //     Bucket: AWSconfig.s3.bucketName
    // });

    // s3.deleteObject({ Bucket: AWSconfig.s3.bucketName, Key: s3Object.key }, async (err, data) => {
    await ShopVideoTour.updateOne(query, {active: false});
    // await ShopShares.deleteOne({shop: req.user._id, virtualTourId: req.params.id});
    res.sendSuccess('The video has been removed!');
    // });

};
