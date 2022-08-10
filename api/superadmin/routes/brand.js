/**
 * @name api_stores_routes
 * @description Users Routes
 */

// controllers
const brand = require("../controllers/brand"),
  // middlewares
  acl = require("../../auth/middlewares/acl");

module.exports = (app) => {
  app
    .route("/brand")
    .post(acl.isAllowed, acl.isSuperAdmin, brand.BrandCreateValidate, brand.BrandDBValidate, brand.create)
    .get(acl.isAllowed,  brand.list);

  app
    .route("/brand/:id")
    .get(acl.isAllowed, acl.isSuperAdmin, brand.find)
    .put(acl.isAllowed, acl.isSuperAdmin, brand.update) 
    .patch(acl.isAllowed, acl.isSuperAdmin, brand.delete); 
    //brand.BrandCreateValidate, brand.BrandDBValidate,

  app.route("/brandConfig/:id")
    .get(acl.isAllowed, brand.getBrandConfig)
    .put(acl.isAllowed, brand.updateBrandConfig);

  app.route("/brandProfile/:id")
    .get(acl.isAllowed, brand.getBrandProfile)
    .put(acl.isAllowed, brand.updateBrandProfile);

  app
    .route("/brand/multiInserts")
    .post(brand.multiInsert);

  app
    .route("/brandApproval/:id")
    .put(acl.isAllowed, acl.isSuperAdmin, brand.brandApproval);
};