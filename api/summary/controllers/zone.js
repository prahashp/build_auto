const { executeQuery } = require("../../../config/database/redshift")
const summaryquery = require("../quries/summary")
const storeService = require("../../stores/services/stores");


module.exports.feature_cards = async(req, res) =>{
    try{
        const result_req ={}
        var getstoresIds = []
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
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.zone_feature_cards(req.body))
        if(query_data[0].total_footfall == "0" || query_data[0].total_footfall == null){
            res.sendNoContent("Data not found");
            return;
        }
        var result = query_data[0];
        if(result.total_footfall !== null || result.male_count !== null ){
            result.male_percent = Math.round((parseInt(result.male_count)/parseInt(result.total_footfall))* 100).toString()
        }else{
            result.male_percent = ""
        }
        if(result.total_footfall !== null || result.female_count !== null ){
        result.female_percent = Math.round((parseInt(result.female_count)/parseInt(result.total_footfall))* 100).toString()
        }else{
            result.female_percent = ""
        }
        result.total_footfall =  result.total_footfall.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        res.sendSuccess({ result: result, result_req: result_req })

    }catch(error){
        console.log(error)
        res.sendServerError(error)
    }
}

module.exports.top_perform_stores = async(req, res) =>{
    try{
        const result_req ={}
        var getstoresIds = []
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
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.top_perform_stores(req.body))
        if(query_data.length == 0){
            res.sendNoContent("Data not found");
            return;
        }
        for(let i = 0; i<getstoresIds.length; i++){
            for(let j=0; j<query_data.length; j++){
                if(getstoresIds[i].id === query_data[j].store_id){
                    query_data[j].store_name = getstoresIds[i].name
                }else continue;
            }
        }
        res.sendSuccess({ result: query_data, result_req: result_req })
    }catch(error){
        console.log(error)
        res.sendServerError(error) 
    }
}

// overall zone status of selected store
module.exports.graph = async(req, res) =>{
    try{
        const result_req ={}
        var getstoresIds = []
        ////Change Store name to store Id ///////
        if(req.body.storeId && req.body.storeId.length>0){
            const query = {
                name: { $in: req.body.storeId },
                active: true
            }
            getstoresIds = await storeService.getOne(query,{id:1,name:1})
            if (!getstoresIds) {
                res.sendNoContent("Data Not Found");
                return;
            }
            req.body.storeId =[getstoresIds.id]
        }else{
            res.sendNoContent("Data Not Found");
            return;
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        // req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.graph(req.body))
        if(query_data.length == 0){
            res.sendNoContent("Data not found");
            return;
        }
        query_data[0].store_name = getstoresIds.name
        res.sendSuccess({ result: query_data, result_req: result_req })

    }catch(error){
        console.log(error)
    }
}