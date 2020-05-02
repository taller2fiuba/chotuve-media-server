const pino = require("pino");
const pino_http = require("pino-http");
const process = require("process");

const logger = pino({ level: "debug" });

const loggerWarn = pino({ level: "warn" });
const loggerHttp = pino_http({
  logger: loggerWarn,
  customLogLevel: (res, err) => {
    if (res.statusCode >= 500 || err) {
      return "warn";
    }
    // no logea otras cosas porque el logger es loggerWarn
    return "info";
  },
});

// Loggear errores fatales en el proceso node
process.on(
  "uncaughtException",
  pino.final(logger, (err, finalLogger) => {
    finalLogger.error(err, "uncaughtException");
    process.exit(1);
  })
);

process.on(
  "unhandledRejection",
  pino.final(logger, (err, finalLogger) => {
    finalLogger.error(err, "unhandledRejection");
    process.exit(1);
  })
);

exports.logger = logger;
exports.loggerHttp = loggerHttp;
