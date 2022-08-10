/**
 * @name api_core_middlewares_response
 * @description Reponse Middlewares
 */

module.exports = (req, res, next) => {
  res.sendSuccess = (data) => {
    const result = {
      code: 200,
      status: "success",
      data,
    };

    if (typeof data === "string") {
      result.message = data;
      delete result.data;
    }

    res.status(result.code).jsonp(result);
  };

  res.sendUnauthorized = (
    message = "Unauthorized. You are not authenticated to use this service."
  ) => {
    res.status(401).jsonp({
      status: "error",
      code: 401,
      message,
    });
  };
  res.sessionExpired = (
    message = "Unauthorized. You are not authenticated to use this service."
  ) => {
    res.status(402).jsonp({
      status: "error",
      code: 402,
      message,
    });
  };
  res.sendBadRequest = (message = {}) => {
    res.status(400).jsonp({
      status: "error",
      code: 400,
      error: message.error || message,
    });
  };

  res.sendServerError = (message = {}) => {
    res.status(500).jsonp({
      status: "error",
      code: 500,
      message: message.error || message,
    });
  };

  res.edgeAppsendSuccess = (data) => {
    const result = {
      statusCode: 200,
      data,
    };
    if (typeof data === "string") {
      result.message = data;
      delete result.data;
    }
    res.status(result.statusCode).jsonp(result);
  };

  res.sendInactiveError = (message = {}) => {
    res.status(403).jsonp({
      status: "error",
      code: 403,
      message: message.error || message,
    });
  };
  res.edgeappError = () => {
    res.status(404).jsonp({
      statusCode: 404,
    });
  };

  res.sendNoContent = (data) => {
    const result = {
      code: 204,
      status: "success",
      data,
    };

    if (typeof data === "string") {
      result.message = data;
      delete result.data;
    }

    res.status(result.code).jsonp(result);
  };

  next();
};
