/**
 * @name api_core_modules_utils
 * @description Helper Functions
 */

// NPM Modules
const _ = require('lodash'),
    glob = require('glob'),
    uuid = require('uuid'),
    otp = require('otp-generator');

module.exports.getPaths = function (globPatterns, excludes) {
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i'),
        self = this,
        // The output array
        output = [];

    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, self.getPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            var files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(function (file) {
                    var newFile = file;
                    if (_.isArray(excludes)) {
                        for (var i in excludes) {
                            newFile = file.replace(excludes[i], '');
                        }
                    } else {
                        newFile = file.replace(excludes, '');
                    }

                    return newFile;
                });
            }
            output = _.union(output, files);
        }
    }

    return output;
};

module.exports.getUuid = () => {
    return uuid.v4();
};

module.exports.getOtp = () => {
    return otp.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });
};
