/**
 * @name api:core:modules:aws
 * @description AWS Wrapper
 */

// NPM Modules
const aws = require('aws-sdk'),

    // configurations
    config = require('../../../.././config').shopeye_bucket.aws;
// configurations
aws.config.update({
    region: config.auth.region,
    secretAccessKey: config.auth.secretKey,
    accessKeyId: config.auth.accessKey,
    endpoint: 's3.amazonaws.com'
});

// S3
module.exports.S3 = new aws.S3;