module.exports.isEmty = async (req, res, next) => {
  try {
    if (req.body.imageDate) {
      if (
        !req.body.imageDate ||
        req.body.imageDate === undefined ||
        req.body.imageDate === null
      ) {
        res.sendUnauthorized("imageDate is empty");
        return;
      }
    }
    if (req.body.fromDate) {
      if (
        !req.body.fromDate ||
        req.body.fromDate === undefined ||
        req.body.fromDate === null
      ) {
        res.sendUnauthorized("fromDate is empty");
        return;
      }
    }
    if (req.body.toDate) {
      if (
        !req.body.toDate ||
        req.body.toDate === undefined ||
        req.body.toDate === null
      ) {
        res.sendUnauthorized("todate is empty");
        return;
      }
    }
    if (req.body.offset) {
      if (
        !req.body.offset ||
        req.body.offset === undefined ||
        req.body.offset === null ||
        req.body.offset === ""
      ) {
        res.sendUnauthorized("offset is empty");
        return;
      }
    }
    if (req.body.limit) {
      if (
        !req.body.limit ||
        req.body.limit === undefined ||
        req.body.limit === null ||
        req.body.limit === ""
      ) {
        res.sendUnauthorized("limit is empty");
        return;
      }
    }
    if (req.body.storeId.length === 0) {
      res.sendUnauthorized("storeId is empty");
      return;
    }
    if (req.body.time_range) {
      if (req.body.time_range.length === 0) {
        res.sendUnauthorized("timeRange is empty");
        return;
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.isEmtyGrp = async (req, res, next) => {
  try {
    if (
      !req.body.imageDate ||
      req.body.imageDate === undefined ||
      req.body.imageDate === null
    ) {
      res.sendUnauthorized("imageDate is empty");
      return;
    }
    if (req.body.storeId.length === 0) {
      res.sendUnauthorized("storeId is empty");
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.period_validate_old = async (req, res, next) => {
  try {
    if (
      !req.body.period ||
      req.body.period === undefined ||
      req.body.period === null
    ) {
      res.sendUnauthorized("Period is empty");
      return;
    }
    if (req.body.period < 1 || req.body.period > 4) {
      res.sendUnauthorized("Give Valid Value");
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.imagedate = async (req, res, next) => {
  try {
    let validate_error = [];
    if (
      !req.body.hasOwnProperty("imageDate") ||
      req.body.imageDate === undefined ||
      req.body.imageDate === null ||
      req.body.imageDate == ""
    ) {
      validate_error.push("Date Is Required");
    }

    if (new Date(req.body.imageDate) > new Date()) {
      validate_error.push("Date Is Greater Than Current Date");
    }

    if (!req.body.hasOwnProperty("storeId") || req.body.storeId.length == 0) {
      validate_error.push("Store Is Required");
    }

    if (validate_error.length > 0) {
      res.sendBadRequest(validate_error + ",");
      return;
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.period_validate = async (req, res, next) => {
  try {
    let validate_error = [];

    if (
      !req.body.hasOwnProperty("period") ||
      req.body.period === undefined ||
      req.body.period === null
    ) {
      validate_error.push("Period Is Required");
    }

    if (req.body.period < 1 || req.body.period > 4) {
      res.sendUnauthorized("Period Is invalid");
      return;
    }

    if (validate_error.length > 0) {
      res.sendBadRequest(validate_error + ",");
      return;
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.type_validate = async (req, res, next) => {
  try {
    let validate_error = [];

    if (
      !req.body.hasOwnProperty("type") ||
      req.body.type === undefined ||
      req.body.type === null
    ) {
      validate_error.push("Type Is Required");
    }

    if (req.body.type < 1 || req.body.type > 4) {
      res.sendUnauthorized("Type Is Invalid");
      return;
    }

    if (validate_error.length > 0) {
      res.sendBadRequest(validate_error + ",");
      return;
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.type_validate_old = async (req, res, next) => {
  try {
    if (
      !req.body.type ||
      req.body.type === undefined ||
      req.body.type === null
    ) {
      res.sendUnauthorized("type is empty");
      return;
    }
    if (req.body.type < 1 || req.body.type > 4) {
      res.sendUnauthorized("Give Valid Value");
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.dateValidate = async (req, res, next) => {
  try {
    if (new Date(req.body.fromDate) > new Date(req.body.toDate)) {
      res.sendUnauthorized("fromdate is greater than toDate ");
      return;
    }
    if (new Date(req.body.toDate) > new Date()) {
      res.sendUnauthorized("todate is greater than Current date ");
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.cardValidater_old = async (req, res, next) => {
  try {
    let errorMsg = "";
    if (
      req.body.fromDate == "" ||
      req.body.fromDate === undefined ||
      req.body.fromDate === null
    ) {
      errorMsg = errorMsg + " fromDate is required,";
    } else if (new Date(req.body.fromDate) > new Date(req.body.toDate)) {
      errorMsg = errorMsg + "fromdate is greater than toDate,";
    }

    if (
      req.body.toDate == "" ||
      req.body.toDate === undefined ||
      req.body.toDate === null
    ) {
      errorMsg = errorMsg + " toDate is required,";
    } else if (new Date(req.body.toDate) > new Date()) {
      errorMsg = errorMsg + "todate is greater than Current date,";
    }

    if (req.body.storeId && req.body.storeId.length > 0) {
    } else {
      errorMsg = errorMsg + " Store is required";
    }

    if (errorMsg && errorMsg.toString().length > 0) {
      res.sendBadRequest(errorMsg);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.inputValidater = async (req, res, next) => {
  try {
    let validate_error = [];
    let date1, date2, diffDays,diffTime;
    if (
      !req.body.hasOwnProperty("fromDate") ||
      req.body.fromDate == "" ||
      req.body.fromDate === undefined ||
      req.body.fromDate === null
    ) {
      validate_error.push("From Date Is Required");
    } else if (new Date(req.body.fromDate) > new Date(req.body.toDate)) {
      validate_error.push("From Date Is Greater Than To Date");
    }

    if (
      !req.body.hasOwnProperty("toDate") ||
      req.body.toDate == "" ||
      req.body.toDate === undefined ||
      req.body.toDate === null
    ) {
      validate_error.push("To Date Is Required");
    } else if (new Date(req.body.toDate) > new Date()) {
      validate_error.push("To Date Is Greater Than Current Date");
    }

    date1 = new Date(req.body.fromDate);
    date2 = new Date(req.body.toDate);
    diffTime = Math.abs(date2 - date1);
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if(diffDays>93){
      validate_error.push("Selected date range is more than 90 days");
    }

    if (
      !req.body.hasOwnProperty("storeId") ||
      req.body.storeId == null ||
      req.body.storeId == "" ||
      req.body.storeId == undefined ||
      req.body.storeId.length == 0
    ) {
      validate_error.push("Store Is Required");
    }

    if (validate_error.length > 0) {
      res.sendBadRequest(validate_error + ",");
      return;
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.timeRangeValidater = async (req, res, next) => {
  try {
    let validate_error = [];

    if (!req.body.hasOwnProperty("time_range")) {
      validate_error.push("Time Range Is Required");
    } else if (
      req.body.time_range.length < 1 ||
      req.body.time_range.length > 24
    ) {
      res.sendUnauthorized("Time Range Is Invalid");
      return;
    }

    if (validate_error.length > 0) {
      res.sendBadRequest(validate_error + ",");
      return;
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};

module.exports.heatMapValidator = async (req, res, next) => {
  try {
    if (req.body.storeId.length === 0) {
      res.sendUnauthorized("storeId is empty");
      return;
    }
    if (req.body.zone_name.length === 0) {
      res.sendUnauthorized("zone name is empty");
      return;
    }
    if (req.body.stream_id.length === 0) {
      res.sendUnauthorized("stream id is empty");
      return;
    }
    if (req.body.type < 1 || req.body.type > 3) {
      res.sendUnauthorized("Type Is Invalid");
      return;
    }
    if (
      !req.body.hasOwnProperty("fromDate") ||
      req.body.fromDate == "" ||
      req.body.fromDate === undefined ||
      req.body.fromDate === null
    ) {
      validate_error.push("From Date Is Required");
    } else if (new Date(req.body.fromDate) > new Date(req.body.toDate)) {
      validate_error.push("From Date Is Greater Than To Date");
    }

    if (
      !req.body.hasOwnProperty("toDate") ||
      req.body.toDate == "" ||
      req.body.toDate === undefined ||
      req.body.toDate === null
    ) {
      validate_error.push("To Date Is Required");
    } else if (new Date(req.body.toDate) > new Date()) {
      validate_error.push("To Date Is Greater Than Current Date");
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendServerError(error);
    return;
  }
};
