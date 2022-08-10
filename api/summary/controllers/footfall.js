const { executeQuery } = require("../../../config/database/redshift");
const summaryquery = require("../quries/summary")
const storeService = require("../../stores/services/stores")
const brandService = require("../../superadmin/services/brand")
module.exports.footfallcard = async (req, res) => {
    try {
        const reqdata = {}
        var getstoresIds = []
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true,
          };
        ////Change Store name to store Id ///////
        if(req.body.storeId && req.body.storeId.length>0){
            const query = {
                name: { $in: req.body.storeId },
                active: true
            }
            getstoresIds = await storeService.getMany(query,{id:1,name:1})
            if (getstoresIds.length === 0) {
                res.sendNoContent("Data Not Found");
                return;
            }
            req.body.storeId =[]
            getstoresIds.forEach((data)=>{
                req.body.storeId.push(data.id)
            })
        }else{
            res.sendNoContent("Data Not Found");
            return;
        } 
        let brand_service = await brandService.getConfig(query1);
        req.body.query = brand_service;
        reqdata.fromDate = req.body.fromDate;
        reqdata.toDate = req.body.toDate;
        reqdata.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.footfallcard(req.body));
        if(query_data[0].total_footfall_count == "0" || query_data[0].total_footfall_count == null){
            res.sendNoContent("Data not found");
            return;
        }
        query_data[0].conversion_count =  Math.round((query_data[0].conversion_count / query_data[0].total_footfall_count) * 100)+"%"
        query_data[0].total_footfall_count = query_data[0].total_footfall_count.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        query_data[0].bounced_footfall_count = query_data[0].bounced_footfall_count.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        query_data[0].missed_opportunity_count = query_data[0].missed_opportunity_count.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")

        for(let i = 0; i<getstoresIds.length; i++){
            for(let j=0; j<query_data.length; j++){
                if(getstoresIds[i].id === query_data[j].store_id){
                    query_data[j].store_name = getstoresIds[i].name
                }else continue;
            }
        }
        res.sendSuccess({ result: query_data[0], result_req: reqdata })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}