/**
 * @name api_core_modules_edgeapp_aws
 * @description AWS Wrapper
 */

// NPM Modules
const aws = require("aws-sdk"),
  // configuration
  config = require("../../../config").edgeapp_aws,
  ms = require("ms");

// aws setup
aws.config.update({
  region: config.auth.region,
  accessKeyId: config.auth.accessKey,
  secretAccessKey: config.auth.secretKey,
});

// AWS Services
const s3 = new aws.S3();

//getting edgeapp download link

module.exports.getDownloadLink = async (filePath) => {
  try {
    var bucketParams = {
      Bucket: config.aws_s3_bucket.bucketName,
      Key: filePath,
      Expires: ms("3h") / 1000,
    };
    let result = await s3.getSignedUrl("getObject", bucketParams);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};
