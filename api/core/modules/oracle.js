/**
 * @name api_core_modules_edgeapp_aws
 * @description AWS Wrapper
 */

const ms = require("ms");

const oracle = require("aws-sdk"),
  config = require("../../../config").oracle;

//oracle config
oracle.config.update({
  region: config.auth.region,
  accessKeyId: config.auth.accessKey,
  secretAccessKey: config.auth.secretKey,
  endpoint: config.auth.endpoint_url,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

// Oracle Services
const s3 = new oracle.S3();

//check if file exist in the folder
module.exports.checkFileExist = async (filePath) => {
  try {
    var bucketParams = {
      Bucket: config.orcale_s3_bucket.bucketName,
      Prefix: filePath,
      Delimiter: "/",
    };
    const data = await s3.listObjectsV2(bucketParams).promise();
    return data.KeyCount;
  } catch (error) {
    console.error(error, "error");
    return error;
  }
};

//listing all files in the folder
module.exports.getFolderData = async (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      let params = {
        Bucket: config.orcale_s3_bucket.bucketName,
        MaxKeys: 1000,
        Prefix: filePath,
      };
      const allKeys = [];
      listAllKeys();
      function listAllKeys() {
        s3.listObjectsV2(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            var contents = data.Contents;
            contents.forEach(function (content) {
              allKeys.push(content.Key);
            });

            if (data.IsTruncated) {
              params.ContinuationToken = data.NextContinuationToken;
              console.log("get further list...");
              listAllKeys();
            } else {
              resolve(allKeys);
            }
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.getDownloadLink = async (filePath) => {
  try {
    var bucketParams = {
      Bucket: config.orcale_s3_bucket.bucketName,
      Key: filePath,
      Expires: ms("4h") / 1000,
    };
    let result = await s3.getSignedUrl("getObject", bucketParams);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports.checkVideoFolderExits = async (videoPath) => {
  try {
    var bucketParams = {
      Bucket: config.orcale_s3_bucket.bucketNameVideo,
      Prefix: videoPath,
      Delimiter: "/",
    };
    const data = await s3.listObjectsV2(bucketParams).promise();
    return data.KeyCount;
  } catch (error) {
    console.error(error, "error");
    return error;
  }
};

module.exports.checkVideoFileExits = async (videoPath) => {
  return new Promise((resolve, reject) => {
    try {
      let params = {
        Bucket: config.orcale_s3_bucket.bucketNameVideo,
        MaxKeys: 1000,
        Prefix: videoPath,
      };
      const allKeys = [];
      listAllKeys();
      function listAllKeys() {
        s3.listObjectsV2(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            var contents = data.Contents;
            contents.forEach(function (content) {
              allKeys.push(content.Key);
            });

            if (data.IsTruncated) {
              params.ContinuationToken = data.NextContinuationToken;
              console.log("get further list...");
              listAllKeys();
            } else {
              resolve(allKeys);
            }
          }
        });
      }
    } catch (error) {
      reject(e);
    }
  });
};

module.exports.getVideoDownloadLink = async (videoPath) => {
  try {
    var bucketParams = {
      Bucket: config.orcale_s3_bucket.bucketNameVideo,
      Key: videoPath,
      Expires: ms("4h") / 1000,
    };

    let result = await s3.getSignedUrl("getObject", bucketParams);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//baseImage from bucket
module.exports.getBaseImg = async (filePath) => {
  try {
    var bucketParams = {
      Bucket: config.orcale_s3_bucket.baseImg,
      Key: filePath,
      Expires: ms("4h") / 1000,
    };
    let result = await s3.getSignedUrl("getObject", bucketParams);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//zone mapped json upload
module.exports.jsonupload = async (filePath, data) => {
  try {
    var bucketParams = {
      Bucket: config.orcale_s3_bucket.tagging,
      Key: filePath,
      Body: data,
      ContentType: "application/json",
    };
    const output = await s3.upload(bucketParams).promise();
    return output;
  } catch (error) {
    console.error(error, "error");
    return error;
  }
};

//cropped image download url
module.exports.getCrpImg = async (filePath) => {
  try {
    var bucketParams = {
      Bucket: config.orcale_s3_bucket.tagging,
      Key: filePath,
      Expires: ms("4h") / 1000,
    };
    let result = await s3.getSignedUrl("getObject", bucketParams);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//check file exits in cropped image
module.exports.checkFileExist_tag = async (filePath) => {
  try {
    var bucketParams = {
      Bucket: config.orcale_s3_bucket.tagging,
      Prefix: filePath,
      Delimiter: "/",
    };
    const data = await s3.listObjectsV2(bucketParams).promise();
    return data.KeyCount;
  } catch (error) {
    console.error(error, "error");
    return error;
  }
};