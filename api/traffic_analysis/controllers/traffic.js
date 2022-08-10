const { executeQuery } = require('../../../config/database/redshift');
const storeService = require('../../stores/services/stores')
const trafficQuery = require("../queries/traffic")
const brandService = require("../../superadmin/services/brand");
const _ = require("lodash");
const bluebird = require("bluebird");
const oracle = require("../../core/modules/oracle");

//card
module.exports.card = async (req, res) => {
  try {
    const result_req = {}
    let brand_service = {}
    let type = {}
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true
    }
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != '') {
      let getstoresId = await storeService.getOne({ name: req.body.storeId }, { id: 1 })
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query2 = {
      id: { $in: req.body.storeId },
      active: true,
    };
    let store_service = await storeService.getOne(query2);
    switch (req.body.type) {
      case 1:
        const fields1 = {
          "brandConfigs.bouncedConfigTime": 1,
          "brandConfigs.bouncedConfigTime": 1
        }
        brand_service = await brandService.getConfig(query1, fields1);
        req.body.start = brand_service.brandConfigs.bouncedConfigTime
        req.body.end = brand_service.brandConfigs.bouncedConfigTime
        break;
      case 2:
        const fields2 = {
          "brandConfigs.missedOpportunityStartTime": 1,
          "brandConfigs.missedOpportunityEndTime": 1
        }
        brand_service = await brandService.getConfig(query1, fields2);
        req.body.start = brand_service.brandConfigs.missedOpportunityStartTime
        req.body.end = brand_service.brandConfigs.missedOpportunityEndTime
        break;
      case 3:
        const fields3 = {
          "brandConfigs.conversionConfigTime": 1,
          "brandConfigs.conversionConfigTime": 1
        }
        brand_service = await brandService.getConfig(query1, fields3);
        req.body.start = brand_service.brandConfigs.conversionConfigTime
        req.body.end = brand_service.brandConfigs.conversionConfigTime
        break;
      case 4:
        req.body.start = ">=0"
        req.body.end = ">=0"
        break;
      default:
        break;
    }
    if (!store_service) {
      res.sendNoContent("Data Not Found");
      return;
    }
    // req.body.query = store_service;
    let [queryData1, queryData2] = await Promise.all([executeQuery(trafficQuery.card(req.body)), executeQuery(trafficQuery.graph(req.body))])

    /////Return if no Data///////
    if (queryData1[0].total_group_count == 0 && queryData2[0].footfall == 0) {
      return res.sendNoContent("Folder Already Exits");
    }

    result_req.fromDate = req.body.fromDate
    result_req.toDate = req.body.toDate
    result_req.storeId = req.body.storeId
    result_req.type = req.body.type
    res.sendSuccess({ card: queryData1, graph: queryData2, result_req: result_req })
  } catch (error) {
    console.error(error);
    res.sendServerError(error)
  }
}

module.exports.timeBasedGrpAnalysis_prev = async (req, res) => {
  try {
    let result_req = {};
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true
    }
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != '') {
      let getstoresId = await storeService.getOne({ name: req.body.storeId }, { id: 1 })
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query2 = {
      id: { $in: req.body.storeId },
      active: true,
    };
    let store_service = await storeService.getOne(query2);
    let brand_services = await brandService.getConfig(query1);
    if (!store_service) {
      res.sendNoContent("Data Not Found");
      return;
    }
    req.body.query = brand_services;
    let data = await executeQuery(
      trafficQuery.timeBasedGrpAnalysis_prevdata(req.body)
    );

    /////Return if no Data///////
    if (data.length == 0) {
      return res.sendNoContent("Data Not Found");
    }

    let output = await this.dataFormat(data);
    var imgdata = _.groupBy(output, "hr");
    result_req.imageDate = req.body.imageDate;
    result_req.storeId = req.body.storeId;
    result_req.time_range = req.body.time_range;

    return res.sendSuccess({ result: imgdata, result_req });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.timeBasedGrpAnalysis_thumb = async (req, res) => {
  try {
    let result_req = {};
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != '') {
      let getstoresId = await storeService.getOne({ name: req.body.storeId }, { id: 1 })
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query = {
      id: { $in: req.body.storeId },
      active: true,
    };
    let store_service = await storeService.getOne(query);
    if (!store_service) {
      res.sendUnauthorized("Data Not Found");
      return;
    }

    let data = await executeQuery(
      trafficQuery.timeBasedGrpAnalysis_thumbdata(req.body)
    );
    /////Return if no Data///////
    if (data.length == 0) {
      return res.sendNoContent("Data Not Found");
    }

    let output = await this.dataFormat_thumb(data);
    var imgdata = _.groupBy(output, "hr");
    result_req.imageDate = req.body.imageDate;
    result_req.storeId = req.body.storeId;
    result_req.time_range = req.body.time_range;
    return res.sendSuccess({ result: imgdata, result_req });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.dataFormat = async (data) => {
  try {
    let clientId, storeId, yyyy, mm, dd;
    let res_data = [];
    let tempObj = {};
    for (const f_data of data) {
      let store_id = f_data.store_id.split("-");
      let date = _.split(f_data.date, "-");
      clientId = store_id[0];
      storeId = store_id[1];
      yyyy = date[0];
      mm = date[1];
      dd = date[2];
      tempObj[f_data.group_head_count] = [];
      if (f_data.group_head_count > 1) {
        let s_data = _.split(f_data.group_temp_ids, ",");
        await _.forEach(s_data, async (res) => {
          let path = `${f_data.store_id}/${dd}-${mm}-${yyyy}/display_images/${f_data.time_range}/${clientId}_${storeId}_${dd}_${mm}_${yyyy}_${res}_${f_data.time_range}.jpeg`;
          let output = await this.getdisplay_images(path);

          res_data.push({
            img: output,
            hr: f_data.time_range,
            store_id: f_data.store_id,
            imageDate: f_data.date,
            tempId: res,
            headCount: f_data.group_head_count,
            groupType: f_data.group_type,
            avgDwell: f_data.avg_dwell_time,
            avgAge: f_data.avg_age_range,
            male: f_data.male_count,
            female: f_data.female_count,
            groupEntry: f_data.group_entry_time,
            groupExit: f_data.group_exit_time,
          });
        });
      } else {
        let path = `${f_data.store_id}/${dd}-${mm}-${yyyy}/display_images/${f_data.time_range}/${clientId}_${storeId}_${dd}_${mm}_${yyyy}_${f_data.group_temp_ids}_${f_data.time_range}.jpeg`;
        let output = await this.getdisplay_images(path);
        res_data.push({
          img: output,
          hr: f_data.time_range,
          store_id: f_data.store_id,
          imageDate: f_data.date,
          tempId: f_data.group_temp_ids,
          headCount: f_data.group_head_count,
          groupType: f_data.group_type,
          avgDwell: f_data.avg_dwell_time,
          avgAge: f_data.avg_age_range,
          male: f_data.male_count,
          female: f_data.female_count,
          groupEntry: f_data.group_entry_time,
          groupExit: f_data.group_exit_time,
        });
      }
    }

    return res_data;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

//get specific images
module.exports.getdisplay_images = async (data) => {
  try {
    let folderData = await oracle.getDownloadLink(data);
    return folderData;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.dataFormat_thumb = async (data) => {
  try {
    let clientId, storeId, yyyy, mm, dd;
    let res_data = [];
    let tempObj = {};
    for (const f_data of data) {
      let store_id = f_data.store_id.split("-");
      let date = _.split(f_data.date, "-");
      clientId = store_id[0];
      storeId = store_id[1];
      yyyy = date[0];
      mm = date[1];
      dd = date[2];
      if (f_data.groups > 1) {
        let s_data = _.split(f_data.group_tempids, ",");
        for (var i = 0; i < s_data.length; i++) {
          let path = `${f_data.store_id}/${dd}-${mm}-${yyyy}/thumbnail_images/${f_data.time_range}/${clientId}_${storeId}_${dd}_${mm}_${yyyy}_${s_data[i]}_${f_data.time_range}.jpeg`;
          let output = await this.getdisplay_images(path);
          res_data.push({
            img: output,
            hr: f_data.time_range,
            store_id: f_data.store_id,
            imageDate: f_data.date,
            tempId: s_data[i],
          });
        }
      } else {
        let path = `${f_data.store_id}/${dd}-${mm}-${yyyy}/thumbnail_images/${f_data.time_range}/${clientId}_${storeId}_${dd}_${mm}_${yyyy}_${f_data.group_temp_ids}_${f_data.time_range}.jpeg`;
        let output = await this.getdisplay_images(path);
        res_data.push({
          img: output,
          hr: f_data.time_range,
          store_id: f_data.store_id,
          imageDate: f_data.date,
          tempId: f_data.group_temp_ids,
        });
      }
    }
    return res_data;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.rangeAnalysisGrp_thumb = async (req, res) => {
  try {
    let result_req = {};
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != '') {
      let getstoresId = await storeService.getOne({ name: req.body.storeId }, { id: 1 })
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query = {
      id: { $in: req.body.storeId },
      active: true,
    };
    let store_service = await storeService.getOne(query);
    if (!store_service) {
      res.sendUnauthorized("Data Not Found");
      return;
    }
    let data = await executeQuery(
      trafficQuery.rangeAnalysisGrp_thumbdata(req.body)
    );

    /////Return if no Data///////
    if (data.length == 0) {
      return res.sendNoContent("Data Not Found");
    }

    let output = await this.range_DataFormat_thumb(data);
    var imgdata = _.groupBy(output, "range");
    result_req.imageDate = req.body.imageDate;
    result_req.storeId = req.body.storeId;
    result_req.time_range = req.body.time_range;

    return res.sendSuccess({ result: imgdata, result_req });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.range_DataFormat_thumb = async (data) => {
  try {
    let clientId, storeId, yyyy, mm, dd;
    let res_data = [];
    let tempObj = {};
    for (const f_data of data) {
      let store_id = f_data.store_id.split("-");
      let date = _.split(f_data.date, "-");
      clientId = store_id[0];
      storeId = store_id[1];
      yyyy = date[0];
      mm = date[1];
      dd = date[2];
      if (_.includes(f_data.group_temp_ids, ",")) {
        let s_data = _.split(f_data.group_temp_ids, ",");
        for (var i = 0; i < s_data.length; i++) {
          let hr_data = _.split(s_data[i], "_");
          let path = `${f_data.store_id}/${dd}-${mm}-${yyyy}/thumbnail_images/${hr_data[1]}/${clientId}_${storeId}_${dd}_${mm}_${yyyy}_${s_data[i]}.jpeg`;
          let output = await this.getdisplay_images(path);
          res_data.push({
            img: output,
            hr: hr_data[1],
            store_id: f_data.store_id,
            imageDate: f_data.date,
            tempId: hr_data[0],
            range: f_data.group_range,
          });
        }
      } else {
        let hr_data = _.split(group_temp_ids, "_");
        let path = `${f_data.store_id}/${dd}-${mm}-${yyyy}/thumbnail_images/${hr_data[1]}/${clientId}_${storeId}_${dd}_${mm}_${yyyy}_${res}.jpeg`;
        let output = await this.getdisplay_images(path);
        res_data.push({
          img: output,
          hr: hr_data[1],
          store_id: f_data.store_id,
          imageDate: f_data.date,
          tempId: hr_data[0],
          range: f_data.group_range,
        });
      }
    }

    return res_data;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.rangeAnalysisGrp_prev = async (req, res) => {
  try {
    let result_req = {};
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true
    }
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != '') {
      let getstoresId = await storeService.getOne({ name: req.body.storeId }, { id: 1 })
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query2 = {
      id: { $in: req.body.storeId },
      active: true,
    };
    let store_service = await storeService.getOne(query2);
    let brand_services = await brandService.getConfig(query1);
    if (!store_service) {
      res.sendNoContent("Data Not Found");
      return;
    }
    req.body.query = brand_services;
    let data = await executeQuery(
      trafficQuery.rangeAnalysisGrp_prevdata(req.body)
    );

    /////Return if no Data///////
    if (data.length == 0) {
      return res.sendNoContent("Data Not Found");
    }

    let output = await this.range_DataFormat_prev(data);
    var imgdata = _.groupBy(output, "headCount");
    result_req.imageDate = req.body.imageDate;
    result_req.storeId = req.body.storeId;
    result_req.time_range = req.body.time_range;

    return res.sendSuccess({ result: imgdata, result_req });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.range_DataFormat_prev = async (data) => {
  try {
    let clientId, storeId, yyyy, mm, dd;
    let res_data = [];
    for (const f_data of data) {
      let store_id = f_data.store_id.split("-");
      let date = _.split(f_data.date, "-");
      clientId = store_id[0];
      storeId = store_id[1];
      yyyy = date[0];
      mm = date[1];
      dd = date[2];
      if (_.includes(f_data.group_temp_ids, ",")) {
        let s_data = _.split(f_data.group_temp_ids, ",");
        for (var i = 0; i < s_data.length; i++) {
          let path = `${f_data.store_id}/${dd}-${mm}-${yyyy}/display_images/${f_data.hour}/${clientId}_${storeId}_${dd}_${mm}_${yyyy}_${s_data[i]}_${f_data.hour}.jpeg`;
          let output = await this.getdisplay_images(path);
          res_data.push({
            img: output,
            hr: f_data.hour,
            store_id: f_data.store_id,
            imageDate: f_data.date,
            tempId: s_data[i],
            headCount: f_data.group_range,
            groupType: f_data.group_type,
            avgDwell: f_data.avg_dwell_time,
            avgAge: f_data.avg_age_range,
            male: f_data.male_count,
            female: f_data.female_count,
            groupEntry: f_data.group_entry_time,
            groupExit: f_data.group_exit_time,
          });
        }
      } else {
        let path = `${f_data.store_id}/${dd}-${mm}-${yyyy}/display_images/${f_data.hour}/${clientId}_${storeId}_${dd}_${mm}_${yyyy}_${f_data.group_temp_ids}_${f_data.hour}.jpeg`;
        let output = await this.getdisplay_images(path);
        res_data.push({
          img: output,
          hr: f_data.hour,
          store_id: f_data.store_id,
          imageDate: f_data.date,
          tempId: f_data.group_temp_ids,
          headCount: f_data.group_range,
          groupType: f_data.group_type,
          avgDwell: f_data.avg_dwell_time,
          avgAge: f_data.avg_age_range,
          male: f_data.male_count,
          female: f_data.female_count,
          groupEntry: f_data.group_entry_time,
          groupExit: f_data.group_exit_time,
        });
      }
    }

    return res_data;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

//table
module.exports.table = async (req, res) => {
  try {
    let result_req = {};
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != '') {
      let getstoresId = await storeService.getOne({ name: req.body.storeId }, { id: 1 })
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query = {
      id: { $in: req.body.storeId },
      active: true
    };

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
    let store_service = await storeService.getOne(query)
    if (!store_service) {
      res.sendNoContent("Data Not Found");
      return;
    }

    let [queryData1, queryData2] = await Promise.all([executeQuery(trafficQuery.table(req.body)), executeQuery(trafficQuery.table_count(req.body))])
    /////Return if no Data///////
    if (parseInt(queryData2[0].total_records_count) == 0) {
      return res.sendNoContent("Data not found");
    }

    for (let i = 0; i < queryData1.length; i++) {
      queryData1[i].male_per = Math.round((parseInt(queryData1[i].male_count) / parseInt(queryData1[i].footfall)) * 100).toString()
      queryData1[i].female_per = Math.round((parseInt(queryData1[i].female_count) / parseInt(queryData1[i].footfall)) * 100).toString()
    }

    res.sendSuccess({ count: parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req })
  } catch (error) {
    res.sendServerError(error)
  }
}

// overall Analysis data
module.exports.overallAnalysis = async (req, res) => {
  try {
    let result_req = {}
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true
    }
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != '') {
      let getstoresId = await storeService.getOne({ name: req.body.storeId }, { id: 1 })
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query2 = {
      id: { $in: req.body.storeId },
      active: true,
    };
    let store_service = await storeService.getOne(query2);
    let brand_services = await brandService.getConfig(query1);
    if (!store_service) {
      res.sendNoContent("Data Not Found");
      return;
    }
    req.body.query = brand_services;
    let [queryData1, queryData2] = await Promise.all([executeQuery(trafficQuery.overallAnalysis(req.body)), executeQuery(trafficQuery.overAllFeature(req.body))])

    /////Return if no Data///////
    if (queryData1[0].total_foot_fall == 0 && queryData2[0].overall == 0) {
      return res.sendNoContent("Folder Already Exits");
    }

    result_req.fromDate = req.body.fromDate
    result_req.toDate = req.body.toDate
    result_req.storeId = req.body.storeId
    res.sendSuccess({ overallAnalysis: queryData1, overAllFeature: queryData2, result_req: result_req })

  } catch (error) {
    console.error(error);
    res.sendServerError(error)
  }
}