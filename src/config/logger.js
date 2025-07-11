const { transports, format, createLogger } = require("winston");
const { combine, colorize, simple } = format;
const expressWinston = require("express-winston");
const logger = createLogger({
  level: "info",
  transports: [new transports.Console()],
  format: combine(colorize({ colors: { info: "yellow" } }), simple()),
});

const req_logger = expressWinston.logger({
  transports: [new transports.Console()],
  format: combine(colorize(), simple()),
  meta: false,
  metaField: null,
  msg(req) {
    return `\n - Incoming request :{{req.method}} {{req.url}}\n Request-body: ${JSON.stringify(
      req.body
    )}
        \n - status code : {{res.statusCode}}\n - Response time: {{res.responseTime}}ms \n - Requested-at ${new Date().toLocaleString()} `;
  },
  colorize: true,
});
module.exports = { logger, req_logger };
