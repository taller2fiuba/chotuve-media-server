const express = require("express");
require("./src/db/mongoose");
const home_routers = require("./src/routers/home");
const video_routers = require("./src/routers/video");
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

const server = app.listen(port, function () {
  logger.info("Media Server iniciado");
});

module.exports = server;
