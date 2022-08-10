// NPM Modules
const _ = require('lodash'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    path = require('path'),

    // configuration
    config = require('../../../.././config').shopeye_bucket.aws.s3,
    // custom modules
    aws = require('../../modules/aws/index');


// S3 Storage
const storage = multerS3({
    s3: aws.S3,
    bucket: config.bucketName,
    key: (req, file, next) => {
        file.originalname = file.originalname.split(' ').join('_')
        const filename = `${_.get(req, 'headers.document', file.originalname.substr(0, file.originalname.lastIndexOf('.')) + '_' + Date.now())}${file.originalname.substr(file.originalname.lastIndexOf('.'))}`;
        let key = `shops/${req.user._id}/`;

        switch (req.headers.category) {
            case 'products':
                key += `products/`;
                break;
            case 'video-tour':
                key += `video-tour/`;
                break;
            case 'unboxing':
                key += `unboxing/`;
                break;
            default:
                key += 'shelfs/';
                break;
        }
console.log(filename, '------------------')
        next(null, key + filename);
    },

});

// Upload Configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: (502 * 1000 * 1000) // 502MB in Bytes
    },
    fileFilter: (req, file, next) => {
        switch ((path.extname(file.originalname)).toLocaleLowerCase()) {
            case '.jpg':
            case '.jpeg':
            case '.png':
            case '.mp4':
            case '.webm':
                return next(null, true);
            default:
                return next(new Error('File is not supported'));
        }
    }
});

// Exports Module
module.exports = upload.single('file');