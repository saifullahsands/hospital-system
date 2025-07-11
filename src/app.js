const express = require("express");
const app = express();
const { req_logger } = require("@config/logger");
const v1_router = require("@v1_router/v1_router");

app.use(express.json({ limit: "100mb" }));

app.use("v1/api", v1_router);
app.use(req_logger);


module.exports = app;
