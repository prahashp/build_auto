/**
 * @name api_core_modules_aws
 * @description AWS Wrapper
 */

// NPM Modules
const aws = require('aws-sdk'),
    bluebird = require('bluebird'),

    // configuration
    config = require('../../.././config').aws;

// aws setup
aws.config.update({
    region: config.auth.region,
    accessKeyId: config.auth.accessKey,
    secretAccessKey: config.auth.secretKey
});

// AWS Services
const SES = new aws.SES();
const SNS = new aws.SNS();

// Sending Email
module.exports.sendEmail = (toEmail, mailSubject, htmlBody) => {
    return new bluebird((resolve, reject) => {
        const params = {
            Destination: {
                ToAddresses: [
                    toEmail
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: htmlBody
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: mailSubject
                }
            },
            Source: config.ses.from
        };

        SES.sendEmail(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

// Send SMS
module.exports.sendSms = (mobileNo, message) => {
    const params = {
        Message: message,
        PhoneNumber: mobileNo
    };

    return new bluebird((resolve, reject) => {
        SNS.publish(params, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    })
};
