/**
 * @name api_auth_routes_auth
 * @description Authentication Routes
 */

// controllers
const auth = require(".././controllers/auth"),
  // middlewares
  acl = require(".././middlewares/acl"),
  passport = require("passport");

module.exports = (app) => {
  app.route("/auth/signup").post(auth.signUpValidater, acl.validate, auth.signup);

  app.route("/auth/signup-service").post(acl.validatepostgres, auth.signUpSyncing)

  app.route("/auth/verify").post(auth.verify);

  app.route("/auth/verifyOTP").post(auth.verifyOTP);

  app.route("/auth/ResendOTP").post(auth.ResendOTP);

  app.route("/auth/login").post(auth.login);

  app.route("/auth/userLogin").post(auth.signInValidater, auth.userLogin);

  app.route("/auth/adminLogin").post(auth.adminLogin);

  app.route("/auth/qrverify").post(auth.qrverify);

  app.route("/auth/me").get(acl.isAllowed_sessionHandler, auth.me);

  app.route("/auth/token").post(auth.token);

  app.route("/auth/forgot-password").post(auth.forgotPasswod);

  app.route("/auth/validate-otp").post(auth.validateOtp);

  app.route("/auth/reset-password").post(auth.resetPassword);

  app.route("/auth/set-password").post(auth.setPassword);

  app.route("/auth/checktoken").post(auth.checktoken);

  app.route('/auth/getClientProfile')
    .get(acl.isAllowed, auth.getClientProfile);

  app.route("/auth/changepassword").post(acl.isAllowed, auth.changePasswordValidater, auth.changePassword);

  app.route("/auth/homepageFlags").get(acl.isAllowed, auth.homepageFlages);
  app.route("/auth/logout").post(acl.isAllowed, auth.logout);




  /**
* @author Shanjay
*
*/
  // app.route("/auth/facebook").get(passport.authenticate("facebook"));

  // app.route("/auth/facebook/callback").get(
  //   passport.authenticate("facebook", {
  //     successRedirect: "/v1/auth/success",
  //     failureRedirect: "/v1/auth/error",
  //   })
  // );
  // app.get("/fail", (req, res) => {
  //   res.send("Failed attempt");
  // });

  //  app.route("/auth/facebook").get(passport.authenticate("facebook"));

  // // app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

  // app.route("/auth/facebook/callback").get(passport.authenticate("facebook", {
  //   successRedirect: "/v1/auth/success",
  //   failureRedirect: "/v1/auth/error",
  //   session: false,
  // }))

  // app.route("/auth/success").get((req, res) => {
  //   res.send("Welcome user. This is Home page");
  // });
  // app.route("/auth/error").get((req, res) => {
  //   res.send("Error");
  // });
};
