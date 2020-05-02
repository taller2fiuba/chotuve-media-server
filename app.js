const express = require("express");
require("./src/db/mongoose");
const home_routers = require("./src/routers/home");
const logger = require("./src/logger").logger;
const loggerHttp = require("./src/logger").loggerHttp;

const app = express();

const port = process.env.PORT;
const router = express.Router();

// middleware que parsea a json todo los request
app.use(express.json());

// Logeador de errores en requests
app.use(loggerHttp);

app.use("/", home_routers);

const server = app.listen(port, function () {
  logger.info("Media Server iniciado");
});

module.exports = server;
