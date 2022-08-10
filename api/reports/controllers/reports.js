const { executeQuery } = require("../../../config/database/redshift");
const reportsQuery = require("../queries/reports");
const brandService = require("../../superadmin/services/brand");
const storeService = require("../../stores/services/stores")

// conversion metrics
module.exports.templateA = async (req, res) =>{
    try {
        let result_req = {}
        const query = {
            name: {$in: req.body.storeId},
            active: true
        }
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true,
          };
          
        let store_service = await storeService.getMany(query);
        let brand_service = await brandService.getConfig(query1);
        if(store_service.length === 0){
            res.sendUnauthorized("Data Not Found");
            return;
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;

        if (req.body.limit >= 10000)
            req.body.limit = 10000

        if(!req.body.limit && !req.body.offset){
            req.body.limit_query = ""
        }else{
            result_req.limit = req.body.limit
            result_req.offset = req.body.offset;
            req.body.offset =  (req.body.offset - 1) * req.body.limit
            req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
            
        }
       
        req.body.storeId =  store_service.map(item => "'"+item.id+"'").toString()
        req.body.query = brand_service
        let [queryData1, queryData2] = await Promise.all([executeQuery(reportsQuery.templateA(req.body)), executeQuery(reportsQuery.templateACount(req.body))]) 
        if(parseInt(queryData2[0].total_records_count) == 0){
            return res.sendNoContent("Data not found");
            
        }
        for(let i = 0; i<store_service.length; i++){

            for(let j=0; j<queryData1.length; j++){
                if(store_service[i].id === queryData1[j].store_id){
                    queryData1[j].store_name = store_service[i].name
                }else continue;
            }
        }
       
        res.sendSuccess({count: parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req})
    }catch(error){
        console.log(error)
        res.sendServerError(error)
    }
}

// group metrics
module.exports.templateB = async (req, res) =>{
    try {
        let result_req = {}
      const query = {
        name: {$in: req.body.storeId},
        active: true
    }
        let store_service = await storeService.getMany(query)
        if(store_service.length === 0){
            res.sendUnauthorized("Data Not Found");
            return;
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;

        if (req.body.limit >= 10000)
            req.body.limit = 10000

        if(!req.body.limit && !req.body.offset){
            req.body.limit_query = ""
        }else{
            result_req.limit = req.body.limit
            result_req.offset = req.body.offset;
            req.body.offset =  (req.body.offset - 1) * req.body.limit
            req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
            
        }
        req.body.storeId =  store_service.map(item => "'"+item.id+"'").toString()
        let [queryData1, queryData2] = await Promise.all([executeQuery(reportsQuery.templateB(req.body)), executeQuery(reportsQuery.templateBCount(req.body))])
        if(parseInt(queryData2[0].total_records_count) == 0){
            return res.sendNoContent("Data not found");
            
        }
        for(let i = 0; i<store_service.length; i++){

            for(let j=0; j<queryData1.length; j++){
                if(store_service[i].id === queryData1[j].store_id){
                    queryData1[j].store_name = store_service[i].name
                }else continue;
            }
        }
        res.sendSuccess({count: parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req})
    }catch(error){
        console.log(error)
        res.sendServerError(error)
    }
}

// store operations metrics
module.exports.templateC = async (req, res) =>{
    try {
        let result_req = {}
        const query = {
            name: {$in: req.body.storeId},
            active: true
        }
        let store_service = await storeService.getMany(query)
        if(store_service.length === 0){
            res.sendUnauthorized("Data Not Found");
            return;
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;

        if (req.body.limit >= 10000)
            req.body.limit = 10000

        if(!req.body.limit && !req.body.offset){
            req.body.limit_query = ""
        }else{
            result_req.limit = req.body.limit
            result_req.offset = req.body.offset;
            req.body.offset =  (req.body.offset - 1) * req.body.limit
            req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
           
        }
        req.body.storeId =  store_service.map(item => "'"+item.id+"'").toString()
        let [queryData1, queryData2] = await Promise.all([executeQuery(reportsQuery.templateC(req.body)), executeQuery(reportsQuery.templateCCount(req.body))]) 
        if(parseInt(queryData2[0].total_records_count) == 0){
            return res.sendNoContent("Data not found");
            
        }
        for(let i = 0; i<store_service.length; i++){

            for(let j=0; j<queryData1.length; j++){
                if(store_service[i].id === queryData1[j].store_id){
                    queryData1[j].store_name = store_service[i].name
                }else continue;
            }
        }
        res.sendSuccess({count:parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req})
    }catch(error){
        console.log(error)
        res.sendServerError(error)
    }
}

// overall metrics
module.exports.templateD = async (req, res) =>{
    try {
        let result_req = {}
        const query = {
            name: {$in: req.body.storeId},
            active: true
        }
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true,
          };

        let store_service = await storeService.getMany(query);
        let brand_service = await brandService.getConfig(query1);
        if(store_service.length === 0){
            res.sendUnauthorized("Data Not Found");
            return;
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;

        if (req.body.limit >= 10000)
            req.body.limit = 10000

        if(!req.body.limit && !req.body.offset){
            req.body.limit_query = ""
        }else{
            result_req.limit = req.body.limit
            result_req.offset = req.body.offset;
            req.body.offset =  (req.body.offset - 1) * req.body.limit
            req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
           
        }
        req.body.storeId =  store_service.map(item => "'"+item.id+"'").toString()
        req.body.query = brand_service
        let [queryData1, queryData2] = await Promise.all([executeQuery(reportsQuery.templateD(req.body)), executeQuery(reportsQuery.templateDCount(req.body))])
        if(parseInt(queryData2[0].total_records_count) == 0){
            return res.sendNoContent("Data not found");
            
        } 
           for(let i = 0; i<store_service.length; i++){

            for(let j=0; j<queryData1.length; j++){
                if(store_service[i].id === queryData1[j].store_id){
                    queryData1[j].store_name = store_service[i].name
                }else continue;
            }
        }
        res.sendSuccess({count:parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req})
    }catch(error){
        console.log(error)
        res.sendServerError(error)
    }
}

// custom metrics
module.exports.customTemplate = async (req, res) =>{
    try{
        result_req ={}
        req.body.query = {
            footfall_count_string: "",
            group_count_string: "",
            engagers_count_string: "",
            bounced_footfall_count_string: "",
            missed_opportunity_count_string: "",
            conversion_count_string: "",
            avg_dwell_time_string: "",
            age_string: "",
            gender_string: "",
        }
        let queryData1 =[],queryData2 =[]
      
        const query = {
            name: {$in: req.body.storeId},
            active: true
        }
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true,
          };

        let store_service = await storeService.getMany(query);
        let brand_service = await brandService.getConfig(query1);
        if(store_service.length === 0){
            res.sendUnauthorized("Data Not Found");
            return;
        }
        req.body.temp_var.some(item => item === 'footfall'? req.body.query.footfall_count_string = ',footfall_count'
        : "")
        req.body.temp_var.some(item => item === 'group_count'? req.body.query.group_count_string = ',group_count'
        :"")
        req.body.temp_var.some(item => item === 'engagers_count'? req.body.query.engagers_count_string = ',engagers_count'
        :"")
        req.body.temp_var.some(item => item === 'bounced_count'? req.body.query.bounced_footfall_count_string = ',bounced_footfall_count'
        : "")
        req.body.temp_var.some(item => item === 'missed_oppurtunity'? req.body.query.missed_opportunity_count_string =`,case when missed_opportunity_type='engagers-conversion' then (select missed_opportunity_count_ec) else (select missed_opportunity_count_gc) end as missed_opportunity_count`
        :"")
        req.body.temp_var.some(item => item === 'conversion'? req.body.query.conversion_count_string =`,conversion_count`
        :"")
        req.body.temp_var.some(item => item === 'avg_dwell'? req.body.query.avg_dwell_time_string =',avg_dwell_time'
        :"")
        req.body.temp_var.some(item => item === 'age'? req.body.query.age_string = `,"age_1-12","age_13-19","age_20-30","age_31-45","age_46-59","age_60_above"`
        : "")
        req.body.temp_var.some(item => item === 'gender'? req.body.query.gender_string = ',male_count,female_count'
        : "" )
  
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        req.body.brand_config = brand_service;

        if (req.body.limit >= 10000)
            req.body.limit = 10000

        if(!req.body.limit && !req.body.offset){
            req.body.limit_query = ""
        }else{
            result_req.limit = req.body.limit
            result_req.offset = req.body.offset;
            req.body.offset =  (req.body.offset - 1) * req.body.limit
            req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
           
        }
        req.body.storeId = store_service.map(item => "'"+item.id+"'").toString()
        switch(req.body.time_filter){
            case 1: 
                [queryData1, queryData2] = await Promise.all([executeQuery(reportsQuery.customTemplateHour(req.body)), executeQuery(reportsQuery.cusTempHrCount(req.body))]) 
                 break;
            case 2:
                [queryData1, queryData2] = await Promise.all([executeQuery(reportsQuery.customTemplateDate(req.body)), executeQuery(reportsQuery.cusTempDateCount(req.body))]);
                break;   

        }
        if(parseInt(queryData2[0].total_records_count) == 0){
            return res.sendNoContent("Data not found");
            
        }
        for(let i = 0; i<store_service.length; i++){

            for(let j=0; j<queryData1.length; j++){
                if(store_service[i].id === queryData1[j].store_id){
                    queryData1[j].store_name = store_service[i].name
                }else continue;
            }
        }
        res.sendSuccess ({count:parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req})

    }catch(error){
        console.log(error)
        res.sendServerError(error)
    }
}