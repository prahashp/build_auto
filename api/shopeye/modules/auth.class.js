const config = require("../../../config");

module.exports = class AuthClass {

  /**
   * Creates an instance of Auth Module.
   */
  constructor() {
    this.jwt = require('jsonwebtoken');
    this.secretKey = config.auth.secretKey;
  }

  /**
   * Method to Sign User Token
   *
   * @param {*} userId
   * @return {*}
   */
  async signToken(user) {
    return new Promise(async (resolve) => {
      // { expiresIn: '12h' }
      const token = this.jwt.sign(user, this.secretKey, {});
      resolve(token);
    });
  }

};
