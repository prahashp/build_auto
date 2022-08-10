const overview = require('../controllers/overview')
const footfall = require('../controllers/footfall')
const traffic = require("../controllers/traffic")
const zone = require("../controllers/zone")
const operations =  require('../controllers/operations')
const acl = require("../../auth/middlewares/acl");
const validation = require("../../conversion_analysis/middlewares/index");

module.exports = (app) => {
    app.route("/summary/overview/getstorescount").get(acl.isAllowed, overview.getstorescount)
    app.route("/summary/overview/feature_cards").post(acl.isAllowed, validation.inputValidater, overview.feature_cards)
    app.route("/summary/overview/footfall").post(acl.isAllowed, validation.inputValidater, overview.footfall)
    app.route("/summary/overview/avg_dwell_time").post(acl.isAllowed, validation.inputValidater, overview.avg_dwell_time)
    app.route("/summary/overview/overviewtable").post(acl.isAllowed, validation.inputValidater, overview.over_view_table)
    app.route("/summary/footfall/footfallcard").post(acl.isAllowed, validation.inputValidater, footfall.footfallcard)
    app.route("/summary/traffic/trafficcard").post(acl.isAllowed, validation.inputValidater, traffic.trafficcard)
    app.route("/summary/traffic/top_perform_store").post(acl.isAllowed, validation.inputValidater, traffic.top_perform_store)
    app.route("/summary/traffic/gender_age_analysis").post(acl.isAllowed, validation.inputValidater, traffic.gender_age_analysis)
    app.route("/summary/traffic/group_graph").post(acl.isAllowed, validation.inputValidater, traffic.group_graph)
    app.route("/summary/traffic/group_top_perform_store").post(acl.isAllowed, validation.inputValidater, traffic.group_top_perform_store)
    app.route("/summary/operations/storetimes").post(acl.isAllowed, validation.inputValidater, operations.storetimes)
    app.route("/summary/operations/avg_optime_lateopen_stores").post(acl.isAllowed, validation.inputValidater, operations.avg_optime_lateopen_stores)
    app.route("/summary/operations/avg_cltime_earlyclose_stores").post(acl.isAllowed, validation.inputValidater, operations.avg_cltime_earlyclose_stores)
    app.route("/summary/operations/deploy_operation_table").post(acl.isAllowed, validation.inputValidater, operations.deploy_operation_table)
    app.route("/summary/operations/lateopen_stores_table").post(acl.isAllowed, validation.inputValidater, operations.lateopen_stores_table)
    app.route("/summary/operations/earlyclose_stores_table").post(acl.isAllowed, validation.inputValidater, operations.earlyclose_stores_table)
    app.route("/summary/zone/feature_cards").post(acl.isAllowed, validation.inputValidater,zone.feature_cards)
    app.route("/summary/zone/top_perform_stores").post(acl.isAllowed, validation.inputValidater,zone.top_perform_stores)
    app.route("/summary/zone/graph").post(acl.isAllowed, validation.inputValidater,zone.graph)
    //praveen
    app.route('/summary/operations/deployedstore').post(acl.isAllowed, validation.dateValidate,operations.deployedstorelist)
    app.route('/summary/operations/activestore').post(acl.isAllowed, validation.dateValidate,operations.activestorelist)
    app.route('/summary/operations/inactivestore').post(acl.isAllowed, validation.dateValidate,operations.inactivestorelist)



    


}