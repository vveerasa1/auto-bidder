const mongoose = require("mongoose");
const { ApiError } = require("../utils/ApiError.js");
const config = require("../config.js");

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], error.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(config.env === "dev" ? { stack: error.stack } : {}),
  };
  return res.status(error.statusCode).json(response);
};

module.exports = { errorHandler };
