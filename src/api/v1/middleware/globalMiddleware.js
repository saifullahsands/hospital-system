const { logger } = require("@config/logger");
const { handle_prisma_error } = require("@config/prisma");
const Responses = require("@constants/responses");
const responses=new Responses()
const globalMiddleware = async (error, request, response, next) => {
  if (response.headerSent) {
    return next(error);
  }
  if (typeof error === "object") {
    let err = error;
    if (!error.status) {
      err = responses.server_error_response(error.message);
    }
    logger.error(error.message);
    return response.status(err?.status?.code || 500).json(err);
  }
  logger.error(error.message);
  const err = handle_prisma_error(error);
  const res = responses.server_error_response(err?.message);
  return response.status(res?.status.code).json(res);
};

module.exports = globalMiddleware;
