/**
 * @name api_edgeapp_modules_stores
 * @description Edgeapp Wrapper Methods
 */

// NPM Modules
const crypto = require("crypto");
//creating sha512 token for app_id
module.exports.getSHA256=(data)=>{
    return crypto.createHash('sha512').update(data).digest('hex');
  }

  module.exports.createStream=(data)=>{
    return crypto.createHash('md5').update(data).digest('hex');
  }