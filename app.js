const express = require("express");
require("./src/db/mongoose");
const home_routers = require("./src/routers/home");
const video_routers = require("./src/routers/video");
const estadisticas_routers = require("./src/routers/estadisticas");
const logger = require("./src/logger").logger;
const loggerHttp = require("./src/logger").loggerHttp;
const cors = require("cors");

const app = express();

const port = process.env.PORT;

// middleware que parsea a json todo los request
app.use(express.json());
// Logeador de responses
app.use(loggerHttp);
app.use(cors());

app.use("/", home_routers);
app.use("/video", video_routers);
app.use("/stats", estadisticas_routers);

// manejador cuando una excepcion no se catchea
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(err, "Excepción no catcheada");
  res.status(500);
}

app.use(errorHandler);

const server = app.listen(port, function () {
  logger.info("Media Server iniciado");
});

module.exports = server;
