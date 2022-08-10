/**
 * @name api_stores_routes
 * @description Stores Routes
 */

// controllers
const stores = require(".././controllers/stores"),
  timeZones = require("../../core/controllers/timeZones"),
  countryCodes = require("../../core/controllers/country-codes"),
  acl = require("../.././auth/middlewares/acl");

module.exports = (app) => {
  app
    .route("/stores")
    .post(acl.isAllowed, stores.storeAddValidater, stores.new)
    .get(acl.isAllowed, stores.list);

  app
    .route("/stores-service/postgres")
    .post(
      stores.sdk_and_store,
      acl.validate_sdk_and_store,
      stores.storeInsertPostgres
    );

  app
    .route("/stores/:id")
    .get(acl.isAllowed, stores.find)
    .put(acl.isAllowed, stores.update)
    .patch(acl.isAllowed, stores.delete);

  app.route("/storesPairingEmail").post(acl.isAllowed, stores.sendMail);

  app.route("/storesexport").get(acl.isAllowed, stores.exporlist);

  app
    .route("/storesBlukUpload")
    .post(acl.isAllowed,
      stores.storelimit,
      stores.bulkuploadstorenamevalidator,
      stores.bulkuploadstoretypevalidator,
      stores.bulkuploadstoreuseremailvalidator,
      stores.bulkuploadstoreuserphonevalidator,
      stores.bulkStore);

  app.route("/timezones").get(timeZones.list);

  app.route("/country-codes").get(countryCodes.list);

  app.route("/store-lists").get(acl.isAllowed, stores.storeList);

  app.route("/searchStore").post(acl.isAllowed, stores.search);

  app
    .route("/storesBlukUploadWithStoreId")
    .post(acl.isAllowed, stores.bulkStoreWithStoreId);

  app.route("/storesBrand").get(acl.isAllowed, stores.findStoreViaBrand);

  //Summary
  app.route("/summaryStoreList").post(acl.isAllowed, stores.summaryStoreList);

  app
    .route("/getStoreLocationforToolbar")
    .get(acl.isAllowed, stores.getStoreLocationforToolbar);

  app
    .route("/getGroupsByLocationforToolbar")
    .post(acl.isAllowed, stores.getGroupsByLocationforToolbar);
};
