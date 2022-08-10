const { executeQuery } = require("../../../config/database/redshift");
const summaryquery = require("../quries/summary")
const storeService = require("../../stores/services/stores")

module.exports.trafficcard = async (req, res) => {
    try {
        const reqdata = {}
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
        reqdata.fromDate = req.body.fromDate;
        reqdata.toDate = req.body.toDate;
        reqdata.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.trafficcard(req.body));
        if(query_data[0].total_footfall == "0" || query_data[0].total_footfall == null ){
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
        var result = query_data[0]
        if(result.total_footfall == 0){
            res.sendNoContent("Data not found");
            return;
        }
        result.male_percent = Math.round((parseInt(result.male_count)/parseInt(result.total_footfall))* 100).toString()
        result.female_percent = Math.round((parseInt(result.female_count)/parseInt(result.total_footfall))* 100).toString()
        result.total_footfall = result.total_footfall.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        result.overall_group_count = result.overall_group_count.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        result.individual_shopper = result.individual_shopper.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        result.group_shoppers = result.group_shoppers.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        

        
        res.sendSuccess({ result: [result], result_req: reqdata })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}
module.exports.top_perform_store = async (req, res) => {
    try {
        const reqdata = {}
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
        reqdata.fromDate = req.body.fromDate;
        reqdata.toDate = req.body.toDate;
        reqdata.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.top_perform_store(req.body));
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
         res.sendSuccess({ result: query_data, result_req: reqdata })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}
module.exports.gender_age_analysis = async (req, res) => {
    try {
        const reqdata = {}
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
        reqdata.fromDate = req.body.fromDate;
        reqdata.toDate = req.body.toDate;
        reqdata.storeId = req.body.storeId;
        // req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.gender_age_analysis(req.body));
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
        var result = query_data[0]
        result.male_percent = Math.round((parseInt(result.male_count)/parseInt(result.total_footfall))* 100).toString()
        result.female_percent = Math.round((parseInt(result.female_count)/parseInt(result.total_footfall))* 100).toString()
        res.sendSuccess({ result: result, result_req: reqdata })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}
module.exports.group_graph = async (req, res) => {
    try {
        const reqdata = {}
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
        reqdata.fromDate = req.body.fromDate;
        reqdata.toDate = req.body.toDate;
        reqdata.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        if(req.body.type == "daily"){
        query_data = await executeQuery(summaryquery.daily_group_graph(req.body));
        }else if(req.body.type == "weekly"){
        query_data = await executeQuery(summaryquery.weekly_group_graph(req.body));
        }else if(req.body.type == "monthly"){
            query_data = await executeQuery(summaryquery.monthly_group_graph(req.body));
        }else{
            query_data = await executeQuery(summaryquery.daily_group_graph(req.body));
        }
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
       res.sendSuccess({ result: query_data, result_req: reqdata })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}
module.exports.group_top_perform_store = async (req, res) => {
    try {
        const reqdata = {}
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
        reqdata.fromDate = req.body.fromDate;
        reqdata.toDate = req.body.toDate;
        reqdata.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.group_top_perform_store(req.body));
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
       res.sendSuccess({ result: query_data, result_req: reqdata })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}


