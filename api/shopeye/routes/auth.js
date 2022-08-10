/**
 * @name api:shops:routes:auth
 * @description Authentication Routes
 */

// controllers
const auth = require('.././controllers/auth')
    // authenticate = require('../../core/middlewares/authenticate');

module.exports = app => {
    app.route('/shops/auth/login')
        .post(auth.login);

    app.route('/shops/auth/register')
        .post(auth.register);

    app.route('/shops/auth/verify')
        .post(auth.verify);

    app.route('/shops/auth/resend-otp')
        .post(auth.resendOTP);

    app.route('/shops/auth/profile')
        .put( auth.updateProfile);
        
};
