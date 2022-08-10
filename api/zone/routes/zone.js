const acl = require("../../auth/middlewares/acl");
const validation = require("../../conversion_analysis/middlewares/index");
const controller = require("../controllers/zone");
module.exports=(app)=>{

    app.route('/zone/analysis')
    .post(acl.isAllowed,validation.inputValidater,controller.analysis)
    
    app.route('/zone/zoneHeatMap')
    .post(acl.isAllowed,validation.heatMapValidator,controller.heatMap)
}