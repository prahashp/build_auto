/**
 * @name api_core_modules_sms
 * @description SMS Module
 */

// Modules
const aws = require('.././aws');

module.exports.sendResetPasswordSms = data => {
    const template = `${data.otp} is your One Time Verification(OTP) code.Please do share this with anyone.This (OTP) code is valid for 3 mins`;
// console.log("template =>", template);
    return aws.sendSms(data.phone, template);
};

module.exports.sendRegisteredSms = data => {
    const template = `${data.otp} is your One Time Verification (OTP) code to confirm your phone number at Shop eye. Please do not share this with anyone. This (OTP) code is valid for only 5 mins`;
// console.log("template =>", template);
    return aws.sendSms(data.phone, template);
};

module.exports.sendPasswordSms = data => {
    const template = `${data.otp} is your One Time Verification(OTP) code.Please do share this with anyone.This (OTP) code is valid for 3 mins`;
// console.log("template =>", template);
    return aws.sendSms(data.phone, template);
};