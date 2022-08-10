const { executeQuery } = require("../../../config/database/redshift");
const summaryquery = require("../quries/summary")
const storeService = require("../../stores/services/stores");
const store = require("../../stores/models/store");
const brandService = require("../../superadmin/services/brand");



module.exports.getstorescount = async (req, res) => {
    try {
        var result ={}
        let deployed_store = await storeService.getCount({ brandId: req.user.brandId })
        let live_store = await storeService.getCount({ brandId: req.user.brandId, active: true })
        let notlive_store = await storeService.getCount({ brandId: req.user.brandId, active: false })
        let [deployed_store_count, live_store_count,notlive_store_count] = await Promise.all([deployed_store,live_store,notlive_store])
        result.deployed_store = String(deployed_store_count)
        result.live_store = String(live_store_count)
        result.notlive_store = String(notlive_store_count)
        res.sendSuccess({ result: result})
    } catch (error) {
        console.log(error)
        res.sendServerError(error);
    }
}

module.exports.feature_cards = async (req, res) => {
    try {
        const reqdata = {}
        var getstoresIds = []
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true,
        };
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId.length > 0) {
            const query = {
                name: { $in: req.body.storeId },
                active: true
            }
            getstoresIds = await storeService.getMany(query, { id: 1, name: 1 })
            if (getstoresIds.length === 0) {
                res.sendNoContent("Data Not Found");
                return;
            }
            req.body.storeId = []
            getstoresIds.forEach((data) => {
                req.body.storeId.push(data.id)
            })
        } else {
            res.sendNoContent("Data Not Found");
            return;
        }
        let brand_service = await brandService.getConfig(query1);
        // let deployed_store = await storeService.getCount({ brandId: req.user.brandId })
        // let live_store = await storeService.getCount({ brandId: req.user.brandId, active: true })
        // let notlive_store = await storeService.getCount({ brandId: req.user.brandId, active: false })
        req.body.query = brand_service;
        reqdata.fromDate = req.body.fromDate;
        reqdata.toDate = req.body.toDate;
        reqdata.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.feature_card(req.body));
        // console.log("query_data =>", query_data);

        if (query_data.length == 0) {
            res.sendNoContent("Data not found");
            return;
        }
        for (let i = 0; i < getstoresIds.length; i++) {
            for (let j = 0; j < query_data.length; j++) {
                if (getstoresIds[i].id === query_data[j].store_id) {
                    query_data[j].store_name = getstoresIds[i].name
                } else continue;
            }
        }
        var result = query_data[0]
        if (result.total_footfall_count == 0) {
            res.sendNoContent("Data not found");
            return;
        }
        // result.deployed_store = String(deployed_store)
        // result.live_store = String(live_store)
        // result.notlive_store = String(notlive_store)
        result.coversion_count =  Math.round((result.coversion_count/result.total_footfall_count)*100)+"%"
        result.male_percent = Math.round((parseInt(result.male_count) / parseInt(result.total_footfall_count)) * 100).toString()
        result.female_percent = Math.round((parseInt(result.female_count) / parseInt(result.total_footfall_count)) * 100).toString()
        result.total_footfall_count = result.total_footfall_count.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
        res.sendSuccess({ result: result, result_req: reqdata })
    } catch (error) {
        console.log(error)
        res.sendServerError(error);
    }
}
module.exports.footfall = async (req, res) => {
    try {
        const reqdata = {}
        var getstoresIds = []
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true,
        };
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId.length > 0) {
            const query = {
                name: { $in: req.body.storeId },
                active: true
            }
            getstoresIds = await storeService.getMany(query, { id: 1, name: 1 })
            if (getstoresIds.length === 0) {
                res.sendNoContent("Data Not Found");
                return;
            }
            req.body.storeId = []
            getstoresIds.forEach((data) => {
                req.body.storeId.push(data.id)
            })
        } else {
            res.sendNoContent("Data Not Found");
            return;
        }
        let brand_service = await brandService.getConfig(query1);
        req.body.query = brand_service;
        reqdata.fromDate = req.body.fromDate;
        reqdata.toDate = req.body.toDate;
        reqdata.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.footfall(req.body));
        if (query_data.length == 0) {
            res.sendNoContent("Data not found");
            return;
        }
        for (let i = 0; i < getstoresIds.length; i++) {
            for (let j = 0; j < query_data.length; j++) {
                if (getstoresIds[i].id === query_data[j].store_id) {
                    query_data[j].store_name = getstoresIds[i].name
                } else continue;
            }
        }
        res.sendSuccess({ result: query_data, result_req: reqdata })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}
module.exports.avg_dwell_time = async (req, res) => {
    try {
        const reqdata = {}
        var getstoresIds = []
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId.length > 0) {
            const query = {
                name: { $in: req.body.storeId },
                active: true
            }
            getstoresIds = await storeService.getMany(query, { id: 1, name: 1 })
            if (getstoresIds.length === 0) {
                res.sendNoContent("Data Not Found");
                return;
            }
            req.body.storeId = []
            getstoresIds.forEach((data) => {
                req.body.storeId.push(data.id)
            })
        } else {
            res.sendNoContent("Data Not Found");
            return;
        }
        reqdata.fromDate = req.body.fromDate;
        reqdata.toDate = req.body.toDate;
        reqdata.storeId = req.body.storeId;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        query_data = await executeQuery(summaryquery.avg_dwell_time(req.body));
        if (query_data.length == 0) {
            res.sendNoContent("Data not found");
            return;
        }
        for (let i = 0; i < getstoresIds.length; i++) {
            for (let j = 0; j < query_data.length; j++) {
                if (getstoresIds[i].id === query_data[j].store_id) {
                    query_data[j].store_name = getstoresIds[i].name
                } else continue;
            }
        }
        res.sendSuccess({ result: query_data, result_req: reqdata })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}

module.exports.over_view_table  = async (req, res) =>{
    if(req.body.searchValue !== ""){
        return this.overview_table_search(req, res)
    }
    if(req.body.column_name !== "" && req.body.order  ){
        return this.overview_table_sort(req, res)
    }else{
        return this.overviewtable(req, res)
    }
}
module.exports.overviewtable = async (req, res) => {
    try {
        const result_req = {}
        var getstoresIds = []
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true,
        };
        var deployedDate = []
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId.length > 0) {
            const query = {
                name: { $in: req.body.storeId },
                active: true
            }
            getstoresIds = await storeService.getMany(query, { id: 1, name: 1, createdAt: 1 })
            if (getstoresIds.length === 0) {
                res.sendNoContent("Data Not Found");
                return;
            }
            req.body.storeId = []
            getstoresIds.forEach((data) => {
                req.body.storeId.push(data.id)
            })
        } else {
            res.sendNoContent("Data Not Found");
            return;
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;

        if (req.body.limit >= 10000)
            req.body.limit = 10000

        if (req.body.limit && req.body.offset) {
            result_req.limit = req.body.limit
            result_req.offset = req.body.offset;
            req.body.offset = (req.body.offset - 1) * req.body.limit
            req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
        } else {
            req.body.limit_query = ""
        }
        let brand_service = await brandService.getConfig(query1);
        req.body.query = brand_service;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        let [queryData1, queryData2] = await Promise.all([executeQuery(summaryquery.overviewtable(req.body)), executeQuery(summaryquery.overviewTableCount(req.body))])
        if ((parseInt(queryData2[0].total_records_count) == 0) || (queryData1.length == 0)) {
            res.sendNoContent("Data not found");
            return;
        }
        for (let i = 0; i < getstoresIds.length; i++) {
            for (let j = 0; j < queryData1.length; j++) {
                if (getstoresIds[i].id === queryData1[j].store_id) {
                    queryData1[j].store_name = getstoresIds[i].name
                    queryData1[j].deployedDate = getstoresIds[i].createdAt
                } else continue;
            }
        }
        res.sendSuccess({ count: parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}
module.exports.overview_table_sort =async(req, res) => {
    try {
        const result_req = {}
        var getstoresIds = []
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true,
        };
        var deployedDate = []
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId.length > 0) {
            const query = {
                name: { $in: req.body.storeId },
                active: true
            }
            getstoresIds = await storeService.getMany(query, { id: 1, name: 1, createdAt: 1 })
            if (getstoresIds.length === 0) {
                res.sendNoContent("Data Not Found");
                return;
            }
            req.body.storeId = []
            getstoresIds.forEach((data) => {
                req.body.storeId.push(data.id)
            })
        } else {
            res.sendNoContent("Data Not Found");
            return;
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        result_req.cloumn_name = req.body.cloumn_name
        result_req.order = req.body.order
        if(req.body.order === 1){
            req.body.order_type = "ASC"
        }else if(req.body.order === 2){
            req.body.order_type = "DESC"
        }
        switch(req.body.column_name){
            case 1:
                req.body.column_name = 'date' 
                break;
            case 2:
                req.body.column_name = 'store_id'
                break;
            case 3:
                req.body.column_name = 'footfall_count'
                break;
            case 4:
                req.body.column_name = 'bounced_footfall_count' 
                break;
            case 5:
                req.body.column_name = 'group_count'
                break;
            case 6:
                req.body.column_name = 'missed_opportunity_count'
                break;
            case 7:
                req.body.column_name = 'conversion_count'
                break;                
            case 8:
                req.body.column_name = 'avg_time_spent'
                break;
            case 9:
                req.body.column_name ='infra_down_time_minutes'
                break;
            case 10:
                req.body.column_name = 'age_1-12'
                break;  
            case 11:
                req.body.column_name = 'age_13-19'
                break;  
            case 12:
                req.body.column_name = 'age_20-30'
                break;  
            case 13:
                req.body.column_name = 'age_31-45'
                break; 
            case 14:
                req.body.column_name = 'age_46-59'
                break;  
            case 15:
                req.body.column_name = 'age_60_above'
                break;  
            case 16:
                req.body.column_name = 'male_count'
                break;  
            case 17:
                req.body.column_name = 'female_count'
                break;             
        }
        if (req.body.limit >= 10000)
            req.body.limit = 10000

        if (req.body.limit && req.body.offset) {
            result_req.limit = req.body.limit
            result_req.offset = req.body.offset;
            req.body.offset = (req.body.offset - 1) * req.body.limit
            req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
        } else {
            req.body.limit_query = ""
        }
        let brand_service = await brandService.getConfig(query1);
        req.body.query = brand_service;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        let [queryData1, queryData2] = await Promise.all([ executeQuery(summaryquery.overviewTableSort(req.body)), executeQuery(summaryquery.overviewTableCount(req.body))])
        if (queryData1.length == 0) {
            res.sendNoContent("Data not found");
            return;
        }
        for (let i = 0; i < getstoresIds.length; i++) {
            for (let j = 0; j < queryData1.length; j++) {
                if (getstoresIds[i].id === queryData1[j].store_id) {
                    queryData1[j].store_name = getstoresIds[i].name
                    queryData1[j].deployedDate = getstoresIds[i].createdAt
                } else continue;
            }
        }
        res.sendSuccess({ count: parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }
}
module.exports.overview_table_search =async(req, res) => {
    try {
        const result_req = {}
        var getstoresIds = []
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true,
        };
        var deployedDate = []
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId.length > 0) {
            const query = {
                name: { $in: req.body.storeId },
                active: true
            }
            getstoresIds = await storeService.getMany(query, { id: 1, name: 1, createdAt: 1 })
            if (getstoresIds.length === 0) {
                res.sendNoContent("Data Not Found");
                return;
            }
            req.body.storeId = []
            getstoresIds.forEach((data) => {
                req.body.storeId.push(data.id)
            })
        } else {
            res.sendNoContent("Data Not Found");
            return;
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        result_req.search_value = req.body.search_value;

        if (req.body.limit >= 10000)
            req.body.limit = 10000

        if (req.body.limit && req.body.offset) {
            result_req.limit = req.body.limit
            result_req.offset = req.body.offset;
            req.body.offset = (req.body.offset - 1) * req.body.limit
            req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
        } else {
            req.body.limit_query = ""
        }
        let brand_service = await brandService.getConfig(query1);
        req.body.query = brand_service;
        req.body.storeId = getstoresIds.map(item => "'" + item.id + "'").toString()
        let [queryData1, queryData2] = await Promise.all([executeQuery(summaryquery.overviewTableSearch(req.body)), executeQuery(summaryquery.overviewSearchCount(req.body))])
        if ((parseInt(queryData2[0].total_records_count) == 0) || (queryData1.length == 0)) {
            res.sendNoContent("Data not found");
            return;
        }
        for (let i = 0; i < getstoresIds.length; i++) {
            for (let j = 0; j < queryData1.length; j++) {
                if (getstoresIds[i].id === queryData1[j].store_id) {
                    queryData1[j].store_name = getstoresIds[i].name
                    queryData1[j].deployedDate = getstoresIds[i].createdAt
                } else continue;
            }
        }
        res.sendSuccess({ count: parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)

    }   
}
