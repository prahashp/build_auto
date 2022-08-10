/**
 * @name api_config_express
 * @description express framework configurations
 */

// NPM Modules
const _ = require("lodash"),
  express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  path = require("path"),
  // configurations
  config = require(".././"),
  // custom middlewares
  responseMiddleware = require("../.././api/core/middlewares/response"),
  errorMiddleware = require("../.././api/core/middlewares/error"),
  // custom modules
  utils = require("../.././api/core/modules/utils");

  const awsConfig=require('../secretsmanager/secret_manager')
//passport

const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;
const session_fb = require("express-session");
// Middlewares
module.exports.initMiddlewares = () => {
  // custom middlewares
  this.app.use(responseMiddleware);

  // Express Middlewares
  this.app.use(bodyParser.json({ limit: "500mb" }));
  this.app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  this.app.disable("x-powered-by");
  this.app.set("showStackError", true);
  this.app.use(cors());

  // Public Routes
  utils.getPaths("./api/core/routes/*.js").forEach((filePath) => {
    require(path.resolve(filePath))(this.app);
  });
};

// Routes Configuration
module.exports.initRoutes = () => {
  let router = express.Router();

  // load all routes
  utils.getPaths("./api/!(core)/routes/*.js").forEach((filePath) => {
    require(path.resolve(filePath))(router);
  });

  if (config.integrations) {
    for (let integration of config.integrations) {
      utils
        .getPaths(`./api/integrations/${integration}/!(core)/routes/*.js`)
        .forEach((filePath) => {
          require(path.resolve(filePath))(router);
        });
    }
  }

  this.app.use("/" + config.api.version, router);
};

// Error Handler
module.exports.initErrorHander = () => {
  // Handle 404 Error Request
  this.app.use((req, res, next) => {
    next({
      status: 404,
    });
  });

  // Custom Error Handler
  this.app.use(errorMiddleware);
};

// Express Framework Setup
module.exports.init = () => {
  this.app = express();
  this.initMiddlewares();
  this.initRoutes();
  this.initErrorHander();
  // this.passport();
  awsConfig()
  return this.app;
};

/**
 * @author Shanjay
 *
 */
//passport
// module.exports.passport = () => {
//     this.app.use(session_fb({
//         resave: false,
//         saveUninitialized: true,
//         secret: 'SECRET'
//       }));

//     this.app.use(passport.initialize());
//     this.app.use(passport.session());

// passport.serializeUser(function (user, cb) {
//     cb(null, user);
//   });

//   passport.deserializeUser(function (obj, cb) {
//     cb(null, obj);
//   });

//     // passport.use(
//     //   new facebookStrategy(
//     //     {
//     //       // pull in our app id and secret from our auth.js file
//     //       clientID: config.fb_auth.client_Id,
//     //       clientSecret: config.fb_auth.client_secret_id,
//     //       callbackURL: "https://api.tangodemo.tk/v1/auth/facebook/callback",
//     //     }, // facebook will send back the token and profile
//     //     function (token, refreshToken, profile, done) {
//     //       console.log(profile,"profile");
//     //       return done(null, profile);
//     //     }
//     //   )
//     // );

//     passport.use(new facebookStrategy({
//         clientID: config.fb_auth.client_Id,
//         clientSecret: config.fb_auth.client_secret_id,
//         callbackURL: "https://api.tangodemo.tk/v1/auth/facebook/callback"
//       }, function (accessToken, refreshToken, profile, done) {
//         console.log(profile,"profile");
//         return done(null, profile);
//       }
//     ));

//   };

// module.exports.passport = () => {
//   this.app.use(passport.initialize());
//   passport.use(
//     new facebookStrategy(
//       {
//         clientID: config.fb_auth.client_Id,
//         clientSecret: config.fb_auth.client_secret_id,
//         callbackURL: "https://api.tangodemo.tk/v1/auth/facebook/callback",
//         // profileFields: ['id', 'emails', 'name']
//       },

//       async function (accessToken, refreshToken, profile, done) {
//         console.log(profile, "profile");
//         return done(null, profile);
//       }
//     )
//   );
// };
