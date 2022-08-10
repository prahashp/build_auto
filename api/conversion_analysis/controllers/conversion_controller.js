/**
 * @name api_dashboard_conversion_controllers_store
 * @description Conversion Controller
 * @auther praveenraj
 */

const { executeQuery } = require("../../../config/database/redshift");
const coversion_query = require("../queries/coversion_query");
const operationalQuery = require("../../operational/queries/operational");
dashboardService = require("../../conversion_analysis/services/conversion");
const storeService = require("../../stores/services/stores");
const brandService = require("../../superadmin/services/brand");
const _ = require("lodash");
const oracle = require("../../core/modules/oracle");
const moment = require("moment");

module.exports.getNumberOfDays = async (start, end) => {
  try {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

//converting json to array
module.exports.dataConversion = async (data) => {
  try {
    var dataArr = [];
    newFormat = data.map((e) => {
      dataArr.push([e["date"], e["count"]]);
    });
    return dataArr;
  } catch (error) {
    res.sendServerError(error);
  }
};

//card
module.exports.card = async (req, res) => {
  try {
    let data = {};
    let result_req = {};
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true,
    };

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
    let brand_service = await brandService.getConfig(query1);
    if (!store_service) {
      return res.sendNoContent("Data not found");
    }
    req.body.query = brand_service;
    let result = await executeQuery(coversion_query.card_query(req.body));

    /////Return if no Data///////
    if (result[0].footfall_count == "0" || result[0].footfall_count == null ) {
      return res.sendNoContent("Data not found");
    }

    data = result[0];
    if(brand_service.brandConfigs.missedOpportunityCalculate === 'engagers-conversion'){
      data.missed_opportunity_count = data.engagers_count - data.conversion_count
    }else if(brand_service.brandConfigs.missedOpportunityCalculate === 'group-conversion'){
      data.missed_opportunity_count = data.group_count - data.conversion_group_count - data.bounced_group_count
    }

    if(brand_service.brandConfigs.conversionCalculate === 'footfall-count'){
      data.cc_percent = Math.round((data.conversion_count/data.footfall_count) *100)
    }else if(brand_service.brandConfigs.conversionCalculate === 'engagers-count'){
      data.cc_percent = Math.round((data.conversion_count/data.engagers_count) *100)   
    }

    if(brand_service.brandConfigs.billableCalculate === 'footfall-count'){
      data.billable = data.group_count
    }else if(brand_service.brandConfigs.billableCalculate === 'engagers-count'){
      data.billable = data.engagers_group_count
    }
   

    data.ff_percent = (data.footfall_count / data.footfall_count) * 100;
    data.bf_percent = Math.round(
      (data.bounced_footfall_count / data.footfall_count) * 100
    );
    data.mo_percent = Math.round(
      (data.missed_opportunity_count / data.footfall_count) * 100
    );
    // data.cc_percent = Math.round(
    //   (result[0].conversion_count / result[0].footfall_count) * 100
    // );
    data.eng_percent = Math.round((data.engagers_count / data.footfall_count) * 100)
    data.grp_percent = Math.round((data.billable / data.footfall_count) * 100)
    result_req.fromDate = req.body.fromDate;
    result_req.toDate = req.body.toDate;
    result_req.storeId = req.body.storeId;

    let newData = {};
    newData.footfall_count = parseInt(data.footfall_count);
    newData.group_count = parseInt(data.billable);
    // newData.greater_than_1_min = parseInt(data.greater_than_1_min);
    newData.bounced_footfall_count = parseInt(data.bounced_footfall_count);
    newData.missed_opportunity_count = parseInt(data.missed_opportunity_count);
    newData.conversion_count = parseInt(data.conversion_count);

    let sortable = [];
    for (var a in newData) {
      sortable.push([a, newData[a]]);
    }

    sortable.sort(function (a, b) {
      return a[1] - b[1];
    });

    return res.sendSuccess({ result: { cardData: data, funnelData: sortable }, result_req });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

//report-table
module.exports.table = async (req, res) => {
  try {
    let result_req = {};
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true,
    };
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != "") {
      let getstoresId = await storeService.getOne(
        { name: req.body.storeId },
        { id: 1 }
      );
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query2 = {
      id: { $in: req.body.storeId },
      active: true,
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
    let store_service = await storeService.getOne(query2);
    let brand_service = await brandService.getConfig(query1);
    if (!store_service) {
      res.sendNoContent("Data not found");
      return;
    }
    req.body.query = brand_service;

    let [queryData1, queryData2] = await Promise.all([executeQuery(coversion_query.daily_report_table(req.body)), executeQuery(coversion_query.report_table_count(req.body))])

    /////Return if no Data///////
    if (parseInt(queryData2[0].total_records_count) == 0) {
      return res.sendNoContent("Data not found");
    }

    res.sendSuccess({ count: parseInt(queryData2[0].total_records_count), result: queryData1, result_req: result_req });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

//dwell
module.exports.dwell = async (req, res) => {
  try {
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true,
    };
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != "") {
      let getstoresId = await storeService.getOne(
        { name: req.body.storeId },
        { id: 1 }
      );
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query2 = {
      id: { $in: req.body.storeId },
      active: true,
    };
    let store_service = await storeService.getOne(query2);
    let brand_service = await brandService.getConfig(query1);
    if (!store_service) {
      res.sendNoContent("Data not found");
      return;
    }
    req.body.query = brand_service;
    let query_data = await executeQuery(coversion_query.dwell(req.body));

    /////Return if no Data///////
    if (query_data.length == 0) {
      return res.sendNoContent("Data not found");
    }

    query_data = await this.heatMapData(query_data, "footfall_count");
    res.sendSuccess({ avg_dwell: query_data });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

//graph
module.exports.graph = async (req, res) => {
  try {
    let result_req = {};
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true,
    };
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != "") {
      let getstoresId = await storeService.getOne(
        { name: req.body.storeId },
        { id: 1 }
      );
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query2 = {
      id: { $in: req.body.storeId },
      active: true,
    };
    let store_service = await storeService.getOne(query2);
    let brand_service = await brandService.getConfig(query1);
    if (!store_service) {
      res.sendNoContent("Data not found");
      return;
    }
    req.body.query = brand_service;
    let query_data = [];

    switch (req.body.period) {
      case 1:
        query_data = await executeQuery(coversion_query.hourly_graph(req.body));
        break;
      case 2:
        query_data = await executeQuery(coversion_query.daily_graph(req.body));
        break;
      case 3:
        query_data = await executeQuery(coversion_query.weekly_graph(req.body));
        break;
      case 4:
        query_data = await executeQuery(
          coversion_query.monthly_graph(req.body)
        );
        break;
    }

    /////Return if no Data///////
    if (query_data.length == 0) {
      return res.sendNoContent("Data not found");
    }
    for(let i=0; i<query_data.length ;i++ ){

    if(brand_service.brandConfigs.missedOpportunityCalculate === 'engagers-conversion'){
      query_data[i].missed_opportunity_count = query_data[i].engagers_count - query_data[i].conversion_count
    }else if(brand_service.brandConfigs.missedOpportunityCalculate === 'group-conversion'){
      query_data[i].missed_opportunity_count = query_data[i].group_count - query_data[i].conversion_group_count - query_data[i].bounced_group_count
    }

    if(brand_service.brandConfigs.billableCalculate === 'footfall-count'){
      query_data[i].billable = query_data[i].group_count
    }else if(brand_service.brandConfigs.billableCalculate === 'engagers-count'){
      query_data[i].billable = query_data[i].engagers_group_count
    }
  }


    

    let [dataValue, dataCount] = await Promise.all([
      this.dataFilter(query_data),
      this.dataCount(query_data),
    ]);
    if(brand_service.brandConfigs.conversionCalculate === 'footfall-count'){
      dataCount.perc_co = Math.round(
        (dataCount.count_con / dataCount.count_ff) * 100
      );
    }else if(brand_service.brandConfigs.conversionCalculate === 'engagers-count'){
      dataCount.perc_co = Math.round(
        (dataCount.count_con / dataCount.count_eng) * 100
      );
    }
    result_req.fromDate = req.body.fromDate;
    result_req.toDate = req.body.toDate;
    result_req.storeId = req.body.storeId;
    result_req.period = req.body.period;
    dataCount.perc_ff = Math.round(
      (dataCount.count_ff / dataCount.count_ff) * 100
    );
    dataCount.perc_mo = Math.round(
      (dataCount.count_mo / dataCount.count_ff) * 100
    );
    dataCount.perc_bf = Math.round(
      (dataCount.count_bf / dataCount.count_ff) * 100
    );
    dataCount.perc_eng = Math.round(
      (dataCount.count_eng / dataCount.count_ff) * 100
    );
    dataCount.perc_grp = Math.round(
      (dataCount.count_grp / dataCount.count_ff) * 100
    );
  

    res.sendSuccess({
      result: { Value: dataValue, count: dataCount },
      result_req,
    });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.image_data = async (req, res) => {
  try {
    let arrData = [];
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != "") {
      let getstoresId = await storeService.getOne(
        { name: req.body.storeId },
        { id: 1 }
      );
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    req.body.date = moment(req.body.imageDate).format("DD-MM-YYYY");
    let [getthumbnail, getdisplay] = await Promise.all([
      this.getthumbnail_images(req.body),
      this.getdisplay_images(req.body),
    ]);

    if (
      getthumbnail == "Folder_Doesnt_Exists" ||
      getthumbnail == "Data_not_Found"
    ) {
      return res.sendNoContent("Folder_Doesnt Exists");
    }
    if (
      getdisplay == "Folder_Doesnt_Exists" ||
      getdisplay == "Data_not_Found"
    ) {
      return res.sendNoContent("Folder_Doesnt Exists");
    }
    arrData = [...getthumbnail, ...getdisplay];
    var img_data = _.values(
      _.merge(
        _.keyBy(getthumbnail, "img_name"),
        _.keyBy(getdisplay, "img_name")
      )
    );

    var imgdata = _.groupBy(img_data, "hr_data");
    return res.sendSuccess({ result: imgdata });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.getthumbnail_images = async (data) => {
  try {
    let arrData = [];
    let path = `${data.storeId}/${data.date}/thumbnail_images/`;
    let isFileExists = await oracle.checkFileExist(path);
    if (isFileExists == 0) {
      return "Folder_Doesnt_Exists";
    }
    let folderData = await oracle.getFolderData(path);
    if (folderData.length == 0) {
      return "Data_not_Found";
    } else {
      for (var i = 0; i < folderData.length; i++) {
        const img = folderData[i].split("/");
        const hr = img[3];
        const data = await oracle.getDownloadLink(folderData[i]);
        arrData.push({ hr_data: hr, thumbnail_image: data, img_name: img[4] });
      }
    }
    return arrData;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.getdisplay_images = async (data) => {
  try {
    let arrData = [];
    let path = `${data.storeId}/${data.date}/display_images/`;
    let isFileExists = await oracle.checkFileExist(path);
    if (isFileExists == 0) {
      return "Folder_Doesnt_Exists";
    }
    let folderData = await oracle.getFolderData(path);
    if (folderData.length == 0) {
      return "Data_not_Found";
    } else {
      for (var i = 0; i < folderData.length; i++) {
        const img = folderData[i].split("/");
        const hr = img[3];
        const data = await oracle.getDownloadLink(folderData[i]);
        arrData.push({ hr_data: hr, display_image: data, img_name: img[4] });
      }
    }
    return arrData;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.video_data = async (req, res) => {
  let arrData = [];

  ////Change Store name to store Id ///////
  if (req.body.storeId && req.body.storeId != "") {
    let getstoresId = await storeService.getOne(
      { name: req.body.storeId },
      { id: 1 }
    );
    req.body.storeId = getstoresId.id;
  }
  ////////////////////////////////////////

  // console.log("req.body =>", req.body );
  req.body.date = moment(req.body.imageDate).format("DD-MM-YYYY");
  req.body.fromDate = req.body.imageDate;
  req.body.toDate = req.body.imageDate

  let getVideoData = await this.getVideoData(req.body);
  if (
    getVideoData == "Folder_Doesnt_Exists" ||
    getVideoData == "Data_not_Found" 
  ) {
    return res.sendNoContent("Folder_Doesnt Exists");
  }

  return res.sendSuccess({ result:getVideoData });
};

module.exports.cameraDownTime = async (req, res) => {

  ////Change Store name to store Id ///////
  if (req.body.storeId && req.body.storeId != "") {
    let getstoresId = await storeService.getOne(
      { name: req.body.storeId },
      { id: 1 }
    );
    req.body.storeId = getstoresId.id;
  }
  ////////////////////////////////////////

  req.body.fromDate = req.body.imageDate;
  req.body.toDate = req.body.imageDate

   queryData = await executeQuery(operationalQuery.cameraDownTimeDaily(req.body));
  if ( queryData.length == 0) {
    return res.sendNoContent("Data not found");
  }
  if (parseInt(queryData[0].camera_down_time_minutes) <= 60) {
    queryData[0].store_health_status = "Good"
  }
  if (parseInt(queryData[0].camera_down_time_minutes) >= 61 && parseInt(queryData[0].camera_down_time_minutes) <= 300) {
    queryData[0].store_health_status = "Warning"
  }
  if (parseInt(queryData[0].camera_down_time_minutes) >= 301) {
    queryData[0].store_health_status = "bad"
  }

  return res.sendSuccess({ result: queryData });
};

module.exports.getVideoData = async (data) => {
  try {
    let arrData = [];
    let path = `${data.storeId}/${data.date}/store_video/video.mp4`;
    console.log(path, "path");
    let isVideoExists = await oracle.checkVideoFolderExits(path);
    if (isVideoExists == 0) {
      return "Folder_Doesnt_Exists";
    }
    let folderData = await oracle.checkVideoFileExits(path);
    if (folderData.length == 0) {
      return "Data_not_Found";
    } else {
      const video = folderData[0].split("/");
      const data = await oracle.getVideoDownloadLink(folderData[0]);
      arrData.push({ VideoData: data, video_name: video[0] });
    }
    return arrData;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.dataFilter = async (data) => {
  try {
    let data_ff = [],
      data_mo = [],
      data_bf = [],
      data_con = [],
      data_eng = [],
      data_grp = [],
      result_data = [];
    await _.forEach(data, (value) => {
      data_ff.push({
        footfall_data: value.footfall_count,
        date: value.date1,
      });
      data_mo.push({
        missed_opportunity_data: value.missed_opportunity_count,
        date: value.date1,
      });
      data_bf.push({
        bounced_footfall_data: value.bounced_footfall_count,
        date: value.date1,
      });
      data_con.push({
        conversion_data: value.conversion_count,
        date: value.date1,
      });
      data_eng.push({
        engagers_count_data: value.engagers_count,
        date: value.date1,
      });
      data_grp.push({
        group_count_data: value.billable,
        date: value.date1,
      });
    });
    return {
      footfall_data: data_ff,
      missed_opportunity_data: data_mo,
      bounced_footfall_data: data_bf,
      conversion_data: data_con,
      engagers_count_data: data_eng,
      group_count_data:data_grp
    };
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.dataCount = async (data) => {
  try {
    let data_ff = 0,
      data_mo = 0,
      data_bf = 0,
      data_con = 0;
      data_eng = 0;
      data_grp = 0
    await _.forEach(data, (value) => {
      data_ff = data_ff + parseInt(value.footfall_count); // data_ff.push(parseInt(value.footfall_count));
      data_mo = data_mo + parseInt(value.missed_opportunity_count); // data_mo.push(parseInt(value.missed_opportunity_count));
      data_bf = data_bf + parseInt(value.bounced_footfall_count); // data_bf.push(parseInt(value.bounced_footfall_count));
      data_con = data_con + parseInt(value.conversion_count); // data_con.push(parseInt(value.conversion_count));
      data_eng = data_eng + parseInt(value.engagers_count);
      data_grp = data_grp + parseInt(value.billable)
    });

    return {
      count_ff: data_ff,
      count_mo: data_mo,
      count_bf: data_bf,
      count_con: data_con,
      count_eng: data_eng,
      count_grp: data_grp
    };
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.heatMapData = async (data, type) => {
  try {
    let result = [];
    let fixedtime = [];
    let fixeddate = [];
    const time = _.uniq(_.map(data, "hour"));
    const data_day = _.uniq(_.map(data, "day"));
    for (var i = 8; i <= 23; i++) {
      if (time.indexOf(i) === -1) {
        fixedtime.push(moment(i.toString(), "LT").format("HH:mm"));
      }
    }
    for (var i = 0; i <= 6; i++) {
      if (data_day.indexOf(i) === -1) {
        fixeddate.push(i);
      }
    }
    data = _.groupBy(data, "day");

    let [res_time, res_date] = await Promise.all([
      this.timdiff_hm(data, fixedtime, type),
      this.datdiff_hm(fixeddate, type),
    ]);

    result = [...res_time, ...res_date];
    result = _.map(result, (val) => ({
      time: val.hour,
      day: moment().isoWeekday(parseInt(val.day)).format("ddd"),
      [type]: val[type],
    }));
    result = _.groupBy(_.sortBy(result, "time"), "time");
    result = Object.keys(result).reduce((obj, key) => {
      obj[key] = result[key].sort((a, b) => {
        return (
          parseInt(moment(a.day, "ddd").format("d")) -
          parseInt(moment(b.day, "ddd").format("d"))
        );
      });
      return obj;
    }, {});
    return result;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.timdiff_hm = async (data, fixedtime, type) => {
  try {
    let result = [];
    _.forEach(data, (val, index) => {
      const existTime = _.map(val, "hour");
      const missingTime = _.difference(fixedtime, existTime);
      missingTime.map((v) => {
        val.push({
          hour: v.toString(),
          day: parseInt(index),
          [type]: "0",
        });
      });
      result = [...result, ...val];
    });
    return result;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.datdiff_hm = async (fixedtime, type) => {
  try {
    let result = [];
    let val_data = [];
    _.forEach(fixedtime, (val, index) => {
      for (var i = 8; i <= 23; i++) {
        if (i.toString().length == 1) {
          i = "0".concat(i.toString());
        }
        val_data.push({
          day: val,
          hour: i.toString().concat(":00"),
          [type]: "0",
        });
      }
      result = [...val_data];
    });
    return result;
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.conversionAnalysis_graph = async (req, res) => {
  try {
    let req_result = {};
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true,
    };
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != "") {
      let getstoresId = await storeService.getOne(
        { name: req.body.storeId },
        { id: 1 }
      );
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    const query2 = {
      id: { $in: req.body.storeId },
      active: true,
    };
    let store_service = await storeService.getOne(query2);
    let brand_service = await brandService.getConfig(query1);
    if (!store_service) {
      res.sendNoContent("Data not found");
      return;
    }
    req.body.query = brand_service;
    let query_data = [];

    switch (req.body.period) {
      case 2:
        query_data = await executeQuery(coversion_query.daily_graph(req.body));
        break;
      case 3:
        query_data = await executeQuery(coversion_query.weekly_graph(req.body));
        break;
      case 4:
        query_data = await executeQuery(
          coversion_query.monthly_graph(req.body)
        );
        break;
    }

    /////Return if no Data///////
    if (query_data.length == 0) {
      return res.sendNoContent("Data not found");
    }

    req_result.fromDate = req.body.fromDate;
    req_result.toDate = req.body.toDate;
    req_result.storeId = req.body.storeId;
    req_result.period = req.body.period;

    let dataCount = await this.series_data(query_data);

    res.sendSuccess({
      result: dataCount,
      req_result,
    });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.series_data = async (data) => {
  let data_ff_c = [];
  try {
    await _.forEach(data, (value) => {
      data_ff_c.push({
        ff_c: value.footfall_count,
        moc_c: value.missed_opportunity_count,
        con_c: value.conversion_count,
        date: value.date1,
      });
    });
    return {
      count: data_ff_c,
    };
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.directoryDownload = async (req, res) => {
  try {
    let arrData = [];
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId != "") {
      let getstoresId = await storeService.getOne(
        { name: req.body.storeId },
        { id: 1 }
      );
      req.body.storeId = getstoresId.id || "";
    }
    ////////////////////////////////////////
    req.body.date = moment(req.body.Date).format("DD-MM-YYYY");
    let path = `${req.body.storeId}/${req.body.date}/zip_images/${req.body.storeId}.zip`;
    let folderExits = await oracle.checkFileExist(path);
    if (folderExits == 0) {
      return res.sendNoContent("Folder Already Exits");
    }
    let data = await oracle.getDownloadLink(path);
    arrData.push({ download_link: data });
    return res.sendSuccess(arrData);
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};