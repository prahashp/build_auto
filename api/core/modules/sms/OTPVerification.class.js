const config = require("../../../../config/env");

module.exports = class OTPClass {

  /**
   * Creates an instance of AWS.
   */
  constructor() {
    this.AWS = require('aws-sdk');
    this.AWS.config.update({
        region: config.aws1.auth.region,
        accessKeyId: config.aws1.auth.accessKey,
        secretAccessKey: config.aws1.auth.secretKey
    });
    this.SNS = new this.AWS.SNS();
    this.SNS.setSMSAttributes({
        attributes: { DefaultSMSType: "Transactional" }
    }, (error) => {
        if (error) console.log(error);
    });
  }

  /**
   * Method to invoke AWS service
   *
   * @param {*} phoneNumber
   * @return {*}
   */
  async invokeOTP(phoneNumber, otp) {
    return new Promise(async (resolve, reject) => {
      // let otp = 7777;
      let params = {
          Message: otp+ 'is your Tango Eye reset password code. Please do not share this to anyone',
          MessageStructure: 'string',
          PhoneNumber: phoneNumber
      };
  
      this.SNS.publish(params, (err, data) => {
          if (err) reject({message: err.toString(), error: {err: err, stack: err.stack}});
          console.log('OTP sent successfully', otp)
          resolve({message: 'OTP sent successfully', data: otp});
      });
      // resolve({message: 'OTP sent successfully', data: otp});
    });
  }

};
