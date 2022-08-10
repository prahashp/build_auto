const { executeQuery } = require("../../../config/database/redshift")
const storeServices = require("../../stores/services/stores")
const operationalQuery = require("../queries/operational")
const getNumberOfDays = require("../../conversion_analysis/controllers/conversion_controller")
const moment = require("moment")
const brandService = require("../../superadmin/services/brand")
const oracle = require("../../core/modules/oracle")
const { rangeAnalysisGrp_prevdata } = require("../../traffic_analysis/queries/traffic")

// operations table
module.exports.table = async (req, res) => {
    try {
        let result_req = {}
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId != '') {
            let getstoresId = await storeServices.getOne({ name: req.body.storeId }, { id: 1 })
            req.body.storeId = getstoresId.id || "";
        }
        ////////////////////////////////////////
        const query = {
            id: { $in: req.body.storeId },
            active: true
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
        let store_service = await storeServices.getOne(query)
        if (!store_service) {
            res.sendNoContent("Data Not Found");
            return;
        }
        let [queryData1, queryData2] = await Promise.all([executeQuery(operationalQuery.table(req.body)), executeQuery(operationalQuery.table_count(req.body))])


        /////Return if no Data///////
        if (parseInt(queryData2[0].total_records_count) == 0) {
            return res.sendNoContent("Data not found");
        }

        res.sendSuccess({ count: parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req })
    } catch (error) {
        console.log(error)
        res.sendServerError(error)
    }
}

module.exports.cameraDownTime = async (req, res) => {
    try {
        let result_req = {};
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId != '') {
            let getstoresId = await storeServices.getOne({ name: req.body.storeId }, { id: 1 })
            req.body.storeId = getstoresId.id || "";
        }
        ////////////////////////////////////////
        const query = {
            id: { $in: req.body.storeId },
            active: true
        }
        let queryData = [];
        let store_service = await storeServices.getOne(query)
        if (!store_service) {
            res.sendNoContent("Data Not Found");
            return;
        }
        switch (req.body.period) {
            case 1:
                queryData = await executeQuery(operationalQuery.cameraDownTimeHourly(req.body))
                break;
            case 2:
                queryData = await executeQuery(operationalQuery.cameraDownTimeDaily(req.body))
                break;
            case 3:
                queryData = await executeQuery(operationalQuery.cameraDownTimeWeekly(req.body))
                break;
            case 4:
                queryData = await executeQuery(operationalQuery.cameraDownTimeMonthly(req.body))
                break;
        }
        if(queryData.length == 0){
            return res.sendNoContent("Data not found");  
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        result_req.period = req.body.period;
        res.sendSuccess({ result: queryData, result_req: result_req })

    } catch (error) {
        console.log(error)
        res.sendServerError(error)
    }
}

// opening time graph
module.exports.graph = async (req, res) => {
    try {
        let result_req = {}
        let queryData = [];
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId != '') {
            let getstoresId = await storeServices.getOne({ name: req.body.storeId }, { id: 1 })
            req.body.storeId = getstoresId.id || "";
        }
        ////////////////////////////////////////
        const query = {
            id: { $in: req.body.storeId },
            active: true
        }
        let store_service = await storeServices.getOne(query)
        if (!store_service) {
            res.sendUnauthorized("Data Not Found");
            return;
        }
        switch (req.body.period) {
            case 1:
                queryData = await executeQuery(operationalQuery.dailyData(req.body));
                break;
            case 2:
                queryData = await executeQuery(operationalQuery.weeklyData(req.body));
                break;
            case 3:
                queryData = await executeQuery(operationalQuery.monthlyData(req.body));
                break;
        }
        if(queryData.length == 0){
            return res.sendNoContent("Data not found");   
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        result_req.period = req.body.period;
        res.sendSuccess({ result: queryData, result_req: result_req })

    } catch (error) {
        console.log(error)
        res.sendServerError(error)
    }

}

// store open and close time
module.exports.openCloseTime = async (req, res) => {
    try {
        let result_req = {}
        let queryData = []
        let store_details = {};
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId != '') {
            let getstoresId = await storeServices.getOne({ name: req.body.storeId }, { id: 1 })
            req.body.storeId = getstoresId.id || "";
        }
        ////////////////////////////////////////
        const query1 = {
            _id: { $in: req.user.brandId },
            active: true
        }
        const query2 = {
            id: { $in: req.body.storeId },
            active: true
        }
        const fields = {
            "brandConfigs.storeOpenTime": 1,
            "brandConfigs.storeCloseTime": 1
        }
        let store_service = await storeServices.getOne(query2)
        if (!store_service) {
            res.sendUnauthorized("Data Not Found");
            return;
        }
        let brand_service = await brandService.getConfig(query1, fields);
        const date = new Date(req.body.fromDate)
        let previous = date.setDate(date.getDate() - 1)
        req.body.previous = moment(new Date(previous)).format("YYYY-MM-DD")

        switch (req.body.period) {
            case 1:
                queryData = await executeQuery(operationalQuery.singleDate(req.body));
                break;
            case 2:
                queryData = await executeQuery(operationalQuery.multipleDate(req.body));
                break;
        }
        if(queryData.length == 0){
            return res.sendNoContent("Data not found");
            
        }
        store_details.location = store_service.city ? store_service.city : ""
        store_details.store_name = store_service.name ? store_service.name : ""
        store_details.opening_time = brand_service.brandConfigs.storeOpenTime ? (brand_service.brandConfigs.storeOpenTime).substring(1, 5) : ""
        store_details.closing_time = brand_service.brandConfigs.storeCloseTime ? (brand_service.brandConfigs.storeCloseTime).substring(1, 5) : ""

        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        result_req.period = req.body.period;
        res.sendSuccess({ result: queryData, store_details: store_details, result_req: result_req })

    } catch (error) {
        console.log(error);
        res.sendServerError(error)
    }
}

//operational overview card
module.exports.overView = async (req, res) => {
    try {
        let result_req = {};
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId != '') {
            let getstoresId = await storeServices.getOne({ name: req.body.storeId }, { id: 1 })
            req.body.storeId = getstoresId.id || "";
        }
        ////////////////////////////////////////
        const query = {
            id: { $in: req.body.storeId },
            active: true
        }
        let store_service = await storeServices.getOne(query)
        if (!store_service) {
            res.sendUnauthorized("Data Not Found");
            return;
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        result_req.period = req.body.period;
        switch (req.body.period) {
            case 1:
                let [queryData3, queryData4] = await Promise.all([
                    executeQuery(operationalQuery.singleOverView(req.body)),
                    this.open_close_snap(req.body)]);
                res.sendSuccess({ result: { operating_time: queryData3, snap: queryData4 }, result_req: result_req })
                break;
            case 2:
                let [queryData1, queryData2,snapdata] = await Promise.all([executeQuery(operationalQuery.multiOverView(req.body)), executeQuery(operationalQuery.operGraph(req.body)), this.open_close_snap(req.body)])
                
                res.sendSuccess({ result: { operOverView: queryData1, graph: queryData2 ,snap: snapdata}, result_req: result_req })
                break;
        }

    } catch (error) {
        console.log(error);
        res.sendServerError(error)
    }
}

module.exports.open_close_snap = async (data) => {
    try {
        let snap = [];
        data.fromDate = moment(data.fromDate).format("DD-MM-YYYY");
        let path = `${data.storeId}/${data.fromDate}/operation_snaps`;
        let isFileExists = await oracle.checkFileExist(path);
        if (isFileExists == 0) {
            return "Folder Doesn't Exists"
        }
        let folderData = await oracle.getFolderData(path);
        if (folderData.length == 0) {
            return "Data not Found"
        } else {
            for (let i = 0; i < folderData.length; i++) {
                const img = folderData[i].split("/");
                const hr = img[3];
                const img_name = hr.split('.')
                const data = await oracle.getDownloadLink(folderData[i]);
                snap.push({ id: hr, snap_img: data, img_name: img_name[0] });
            }
        }
        return snap

    } catch (error) {
        console.log(error);
        res.sendServerError(error)
    }
}

// avg open , close and operating hours 
module.exports.avgOpenCloseOper = async (req, res) => {
    try {
        let result_req = {};
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId != '') {
            let getstoresId = await storeServices.getOne({ name: req.body.storeId }, { id: 1 })
            req.body.storeId = getstoresId.id || "";
        }
        ////////////////////////////////////////
        const query = {
            id: { $in: req.body.storeId },
            active: true
        }

        let store_service = await storeServices.getOne(query)
        if (!store_service) {
            res.sendUnauthorized("Data Not Found");
            return;
        }
        let queryData = await executeQuery(operationalQuery.avgOpenCloseOper(req.body))
        if(queryData.length == 0){
            return res.sendNoContent("Data not found");    
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        res.sendSuccess({ result: queryData, result_req: result_req })
    } catch (error) {
        console.log(error);
        res.sendServerError(error);
    }
}

// avg infraDown time
module.exports.avgInfraDown = async (req, res) => {
    try {
        let result_req = {};
        ////Change Store name to store Id ///////
        if (req.body.storeId && req.body.storeId != '') {
            let getstoresId = await storeServices.getOne({ name: req.body.storeId }, { id: 1 })
            req.body.storeId = getstoresId.id || "";
        }
        ////////////////////////////////////////
        const query = {
            id: { $in: req.body.storeId },
            active: true
        }
        let store_service = await storeServices.getOne(query)
        if (!store_service) {
            res.sendUnauthorized("Data Not Found");
            return;
        }
        let queryData = await executeQuery(operationalQuery.avgInfraDown(req.body))
        if(queryData.length == 0){
            return res.sendNoContent("Data not found");    
        }
        result_req.fromDate = req.body.fromDate;
        result_req.toDate = req.body.toDate;
        result_req.storeId = req.body.storeId;
        res.sendSuccess({ result: queryData, result_req: result_req })
    } catch (error) {
        console.log(error);
        res.sendServerError(error);
    }
} 
