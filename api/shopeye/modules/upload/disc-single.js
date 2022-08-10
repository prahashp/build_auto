// NPM Modules
var _ = require('lodash'),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs');

// Storage Configuration
var storage = multer.diskStorage({
    destination: (req, file, next) => {
        let dir = path.resolve(__dirname, `attachements`);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        next(null, dir);
    },

    filename: (req, file, next) => {
        const filename = `${_.get(req, 'headers.document', file.originalname.substr(0, file.originalname.lastIndexOf('.')) + '_' + Date.now())}${file.originalname.substr(file.originalname.lastIndexOf('.'))}`;
        next(null, filename);
    }
});

// Upload Configuration
var upload = multer({
    storage: storage,
    limits: {
        fileSize: (4 * 1000 * 1000) // 4MB in Bytes
    },
    fileFilter: (req, file, next) => {
        switch ((path.extname(file.originalname)).toLocaleLowerCase()) {
            case '.pdf':
            case '.doc':
            case '.docx':
            case '.jpg':
            case '.jpeg':
            case '.png':
                return next(null, true);
            default:
                return next(new Error('File is not supported'));
        }
    }
});

// Exports Module
module.exports = upload.single('file');