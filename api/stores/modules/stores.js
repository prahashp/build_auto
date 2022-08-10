/**
 * @name api_stores_modules_stores
 * @description Store Wrapper Methods
 */

// NPM Modules
const otp = require("otp-generator");
const crypto = require("crypto");

module.exports.generateAppId = () => {
  return otp.generate(7, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};

module.exports.getApplicationId = (brandName, storeId, brandId) => {
  return `${brandName.substring(0, 3)}${this.getMD5Hash(
    `${storeId}${brandId}`
  ).substring(0, 7)}`;
};

module.exports.getMD5Hash = (data) => {
  return crypto.createHash("md5").update(data).digest("hex");
};
