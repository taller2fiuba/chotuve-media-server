const pino = require("pino");
const pino_http = require("pino-http");
const process = require("process");

const logger = pino({ level: "debug" });

const loggerInfo = pino({ level: "info" });
const loggerHttp = pino_http({
  logger: loggerInfo,
  customLogLevel: (res, err) => {
    // errores a warn
    if (res.statusCode >= 500 || err) {
      return "warn";
    }
    // el resto de respuestas a info
    return "info";
  },
});

// Loggear excepciones no cacheadas, si alguna no la detecta express o mismo express la genera
process.on(
  "uncaughtException",
  pino.final(logger, (err, finalLogger) => {
    finalLogger.error(err, "Excepción no catcheada");
  })
);

// Loggear rejects no cacheados
process.on(
  "unhandledRejection",
  pino.final(logger, (err, finalLogger) => {
    finalLogger.error(err, "Promise reject no catcheado");
  })
);

exports.logger = logger;
exports.loggerHttp = loggerHttp;
