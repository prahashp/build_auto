const aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
var config = require('../../.././config').aws
const _ = require("lodash")
// aws.config.update({
//     region: config.auth.region,
//     accessKeyId: config.auth.accessKey,
//     secretAccessKey: config.auth.secretKey
// });
aws.config.update({
    // region: config.auth.region,
    accessKeyId: "AKIA4WA5BVCAT7BHU2W5",
    secretAccessKey: "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"
});


const s3 = new aws.S3();
const storage = multerS3({
    s3: s3,
   // ACL: 'public-read',
    bucket: 'publicbucketappteam',
    key: function (req, file, cb) {
        let name=file.originalname.split('.')
        cb(null,  Date.now() + "." + name[name.length-1]) //use Date.now() for unique file keys
    }
})
const upload = multer({ storage: storage }).single('img');
module.exports.upload = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            res.send(err);
        } else {
            res.sendSuccess({url:req.file.location});
        }
    })
};

module.exports.driveUpload = (req, res, next) => {
    const token = _.get(req.headers, "x-api-key", "");
    if (token == "1b2f5299-5333-41dd-bcdc-8632bf26ae16") {
        upload(req, res, function (err) {
            if (err) {
                console.log(err)
                res.send(err);
            } else {
                res.sendSuccess({url:req.file.location});
            }
        })
   
    }else{
           res.sessionExpired();
      return;
    }

};