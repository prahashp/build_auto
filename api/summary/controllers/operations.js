const { executeQuery } = require("../../../config/database/redshift");
const summaryquery = require("../quries/summary");
const storeService = require("../../stores/services/stores");
const store = require("../../stores/models/store");

module.exports.storetimes = async (req, res) => {
  try {
    const reqdata = {};
    var getstoresIds = [];
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId.length > 0) {
      const query = {
        name: { $in: req.body.storeId },
        active: true,
      };
      getstoresIds = await storeService.getMany(query, { id: 1, name: 1 });
      if (getstoresIds.length === 0) {
        res.sendNoContent("Data Not Found");
        return;
      }
      req.body.storeId = [];
      getstoresIds.forEach((data) => {
        req.body.storeId.push(data.id);
      });
    } else {
      res.sendNoContent("Data Not Found");
      return;
    }
    reqdata.fromDate = req.body.fromDate;
    reqdata.toDate = req.body.toDate;
    reqdata.storeId = req.body.storeId;
    req.body.storeId = getstoresIds
      .map((item) => "'" + item.id + "'")
      .toString();
    let [queryData1, queryData2] = await Promise.all([
      executeQuery(summaryquery.earlyclose_stores(req.body)),
      executeQuery(summaryquery.lateopen_stores(req.body)),
    ]);
    if (queryData1.length == 0 && queryData2.length == 0) {
      res.sendNoContent("Data not found");
      return;
    }
    // for(let i = 0; i<getstoresIds.length; i++){
    //     for(let j=0; j<query_data.length; j++){
    //         if(getstoresIds[i].id === query_data[j].store_id){
    //             query_data[j].store_name = getstoresIds[i].name
    //         }else continue;
    //     }
    // }
    var result1 = queryData1[0];
    var result2 = queryData2[0];
    if (
      result1.total_early_closed_stores == 0 &&
      result2.total_late_opened_stores == 0
    ) {
      res.sendNoContent("Data not found");
      return;
    }
    let response = {};
    response.total_early_closed_stores = result1.total_early_closed_stores;
    response.total_late_opened_stores = result2.total_late_opened_stores;
    res.sendSuccess({ result: response, result_req: reqdata });
  } catch (error) {
    console.error(error);
    res.sendServerError(error);
  }
};

module.exports.avg_optime_lateopen_stores = async (req, res) => {
  try {
    const reqdata = {};
    var getstoresIds = [];
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId.length > 0) {
      const query = {
        name: { $in: req.body.storeId },
        active: true,
      };
      getstoresIds = await storeService.getMany(query, { id: 1, name: 1 });
      if (getstoresIds.length === 0) {
        res.sendNoContent("Data Not Found");
        return;
      }
      req.body.storeId = [];
      getstoresIds.forEach((data) => {
        req.body.storeId.push(data.id);
      });
    } else {
      res.sendNoContent("Data Not Found");
      return;
    }
    reqdata.fromDate = req.body.fromDate;
    reqdata.toDate = req.body.toDate;
    reqdata.storeId = req.body.storeId;
    req.body.storeId = getstoresIds
      .map((item) => "'" + item.id + "'")
      .toString();
    query_data = await executeQuery(
      summaryquery.avg_optime_lateopen_stores(req.body)
    );

    if (query_data.length == 0) {
      res.sendNoContent("Data not found");
      return;
    }
    for (let i = 0; i < getstoresIds.length; i++) {
      for (let j = 0; j < query_data.length; j++) {
        if (getstoresIds[i].id === query_data[j].store_id) {
          query_data[j].store_name = getstoresIds[i].name;
        } else continue;
      }
    }
    res.sendSuccess({ result: query_data, result_req: reqdata });
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

module.exports.avg_cltime_earlyclose_stores = async (req, res) => {
  try {
    const reqdata = {};
    var getstoresIds = [];
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId.length > 0) {
      const query = {
        name: { $in: req.body.storeId },
        active: true,
      };
      getstoresIds = await storeService.getMany(query, { id: 1, name: 1 });
      if (getstoresIds.length === 0) {
        res.sendNoContent("Data Not Found");
        return;
      }
      req.body.storeId = [];
      getstoresIds.forEach((data) => {
        req.body.storeId.push(data.id);
      });
    } else {
      res.sendNoContent("Data Not Found");
      return;
    }
    reqdata.fromDate = req.body.fromDate;
    reqdata.toDate = req.body.toDate;
    reqdata.storeId = req.body.storeId;
    req.body.storeId = getstoresIds
      .map((item) => "'" + item.id + "'")
      .toString();
    query_data = await executeQuery(
      summaryquery.avg_cltime_earlyclose_stores(req.body)
    );
    if (query_data.length == 0) {
      res.sendNoContent("Data not found");
      return;
    }
    for (let i = 0; i < getstoresIds.length; i++) {
      for (let j = 0; j < query_data.length; j++) {
        if (getstoresIds[i].id === query_data[j].store_id) {
          query_data[j].store_name = getstoresIds[i].name;
        } else continue;
      }
    }
    res.sendSuccess({ result: query_data, result_req: reqdata });
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

module.exports.deploy_operation_table = async (req, res) => {
  try {
    const reqdata = {};
    var getstoresIds = [];
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId.length > 0) {
      const query = {
        name: { $in: req.body.storeId },
        active: true,
      };
      getstoresIds = await storeService.getMany(query, { id: 1, name: 1 });
      if (getstoresIds.length === 0) {
        res.sendNoContent("Data Not Found");
        return;
      }
      req.body.storeId = [];
      getstoresIds.forEach((data) => {
        req.body.storeId.push(data.id);
      });
    } else {
      res.sendNoContent("Data Not Found");
      return;
    }
    reqdata.fromDate = req.body.fromDate;
    reqdata.toDate = req.body.toDate;
    reqdata.storeId = req.body.storeId;
    req.body.storeId = getstoresIds
      .map((item) => "'" + item.id + "'")
      .toString();
    query_data = await executeQuery(
      summaryquery.deploy_operation_table(req.body)
    );
    if (query_data.length == 0) {
      res.sendNoContent("Data not found");
      return;
    }
    for (let i = 0; i < getstoresIds.length; i++) {
      for (let j = 0; j < query_data.length; j++) {
        if (getstoresIds[i].id === query_data[j].store_id) {
          query_data[j].store_name = getstoresIds[i].name;
        } else continue;
      }
    }
    res.sendSuccess({ result: query_data, result_req: reqdata });
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

// early close store table
module.exports.lateopen_stores_table = async (req, res) => {
  try {
    const result_req = {};
    var getstoresIds = [];
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true,
    };
    var deployedDate = [];
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId.length > 0) {
      const query = {
        name: { $in: req.body.storeId },
        active: true,
      };
      getstoresIds = await storeService.getMany(query, {
        id: 1,
        name: 1,
        createdAt: 1,
      });
      if (getstoresIds.length === 0) {
        res.sendNoContent("Data Not Found");
        return;
      }
      req.body.storeId = [];
      getstoresIds.forEach((data) => {
        req.body.storeId.push(data.id);
      });
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
      result_req.limit = req.body.limit;
      result_req.offset = req.body.offset;
      req.body.offset = (req.body.offset - 1) * req.body.limit;
      req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`;
    } else {
      req.body.limit_query = "";
    }
    req.body.storeId = getstoresIds
      .map((item) => "'" + item.id + "'")
      .toString();
    let [queryData1, queryData2] = await Promise.all([
      executeQuery(summaryquery.earlyclose_stores_table(req.body)),
      executeQuery(summaryquery.earlyclose_stores_count(req.body)),
    ]);
    if (parseInt(queryData2[0].total_records_count) == 0) {
      res.sendNoContent("Data not found");
      return;
    }
    for (let i = 0; i < getstoresIds.length; i++) {
      for (let j = 0; j < queryData1.length; j++) {
        if (getstoresIds[i].id === queryData1[j].store_id) {
          queryData1[j].store_name = getstoresIds[i].name;
        } else continue;
      }
    }
    res.sendSuccess({
      count: parseInt(queryData2[0].total_records_count),
      result: queryData1,
      result_req: result_req,
    });
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

module.exports.earlyclose_stores_table = async (req, res) => {
  try {
    const result_req = {};
    var getstoresIds = [];
    const query1 = {
      _id: { $in: req.user.brandId },
      active: true,
    };
    var deployedDate = [];
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId.length > 0) {
      const query = {
        name: { $in: req.body.storeId },
        active: true,
      };
      getstoresIds = await storeService.getMany(query, {
        id: 1,
        name: 1,
        createdAt: 1,
      });
      if (getstoresIds.length === 0) {
        res.sendNoContent("Data Not Found");
        return;
      }
      req.body.storeId = [];
      getstoresIds.forEach((data) => {
        req.body.storeId.push(data.id);
      });
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
      result_req.limit = req.body.limit;
      result_req.offset = req.body.offset;
      req.body.offset = (req.body.offset - 1) * req.body.limit;
      req.body.limit_query = `LIMIT ${req.body.limit} OFFSET ${req.body.offset}`;
    } else {
      req.body.limit_query = "";
    }

    req.body.storeId = getstoresIds
      .map((item) => "'" + item.id + "'")
      .toString();
    let [queryData1, queryData2] = await Promise.all([
      executeQuery(summaryquery.lateopen_stores_table(req.body)),
      executeQuery(summaryquery.lateopen_stores_count(req.body)),
    ]);

    if (parseInt(queryData2[0].total_records_count) == 0) {
      res.sendNoContent("Data not found");
      return;
    }
    for (let i = 0; i < getstoresIds.length; i++) {
      for (let j = 0; j < queryData1.length; j++) {
        if (getstoresIds[i].id === queryData1[j].store_id) {
          queryData1[j].store_name = getstoresIds[i].name;
        } else continue;
      }
    }
    res.sendSuccess({
      count: parseInt(queryData2[0].total_records_count),
      result: queryData1,
      result_req: result_req,
    });
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

//praveen
module.exports.deployedstorelist = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    let fDate = new Date(req.body.fromDate);
    fDate.setHours(0, 0, 0, 0);

    let TDate = new Date(req.body.toDate);
    TDate.setHours(23, 59, 59, 999);
    input.query.createdAt = {
      $gte: new Date(fDate.toISOString()),
      $lte: new Date(TDate.toISOString()),
    };
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId.length > 0) {
      const query = {
        name: { $in: req.body.storeId },
        active: true,
      };
      getstoresIds = await storeService.getMany(query, { id: 1, name: 1 });
      if (getstoresIds.length === 0) {
        res.sendNoContent("Data Not Found");
        return;
      }
      req.body.storeId = [];
      getstoresIds.forEach((data) => {
        req.body.storeId.push(data.id);
      });
    }
    if (req.body.storeId) {
      input.query.id = req.body.storeId;
    }
    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }
    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }
    input.record = {};
    input.limit = req.body.limit || 10;
    input.skip = req.body.limit * (req.body.offset-1) || 0;
    let [data, count] = await Promise.all([
      storeService.findLimit(
        input.query,
        input.record,
        input.skip,
        input.limit
      ),
      storeService.getCount(input.query),
    ]);
    return res.sendSuccess({ data, count });
  } catch (error) {
    console.error(error);
    return res.sendServerError(error);
  }
};

module.exports.activestorelist = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    let fDate = new Date(req.body.fromDate);
    fDate.setHours(0, 0, 0, 0);

    let TDate = new Date(req.body.toDate);
    TDate.setHours(23, 59, 59, 999);
    input.query.createdAt = {
      $gte: new Date(fDate.toISOString()),
      $lte: new Date(TDate.toISOString()),
    };
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId.length > 0) {
      const query = {
        name: { $in: req.body.storeId },
        active: true,
      };
      getstoresIds = await storeService.getMany(query, { id: 1, name: 1 });
      if (getstoresIds.length === 0) {
        res.sendNoContent("Data Not Found");
        return;
      }
      req.body.storeId = [];
      getstoresIds.forEach((data) => {
        req.body.storeId.push(data.id);
      });
    }
    if (req.body.storeId) {
      input.query.id = req.body.storeId;
    }
    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }
    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }

    input.query.active = true;
    input.record = {};
    input.limit = req.body.limit || 10;
    input.skip = req.body.limit * (req.body.offset-1) || 0;
    let [data, count] = await Promise.all([
      storeService.findLimit(
        input.query,
        input.record,
        input.skip,
        input.limit
      ),
      storeService.getCount(input.query),
    ]);
    return res.sendSuccess({ data, count });
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};

module.exports.inactivestorelist = async (req, res) => {
  try {
    let input = {};
    input.query = {};
    let fDate = new Date(req.body.fromDate);
    fDate.setHours(0, 0, 0, 0);

    let TDate = new Date(req.body.toDate);
    TDate.setHours(23, 59, 59, 999);
    input.query.createdAt = {
      $gte: new Date(fDate.toISOString()),
      $lte: new Date(TDate.toISOString()),
    };
    ////Change Store name to store Id ///////
    if (req.body.storeId && req.body.storeId.length > 0) {
      const query = {
        name: { $in: req.body.storeId },
        active: true,
      };
      getstoresIds = await storeService.getMany(query, { id: 1, name: 1 });
      if (getstoresIds.length === 0) {
        res.sendNoContent("Data Not Found");
        return;
      }
      req.body.storeId = [];
      getstoresIds.forEach((data) => {
        req.body.storeId.push(data.id);
      });
    }
    if (req.body.storeId) {
      input.query.id = req.body.storeId;
    }
    if (req.user.brandId) {
      input.query.brandId = req.user.brandId;
    }
    if (req.query.brandId) {
      input.query.brandId = req.query.brandId;
    }

    input.query.active = false;
    input.record = {};
    input.limit = req.body.limit || 10;
    input.skip = req.body.limit * (req.body.offset-1) || 0;
    let [data, count] = await Promise.all([
      storeService.findLimit(
        input.query,
        input.record,
        input.skip,
        input.limit
      ),
      storeService.getCount(input.query),
    ]);
    return res.sendSuccess({ data, count });
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
  }
};