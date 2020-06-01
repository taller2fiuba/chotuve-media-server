const express = require("express");
const homeController = require("../controllers/HomeController");
const router = express.Router();
const config = require("../config");

router.get("/ping", homeController.ping);
if (config.node_env == "development") {
  router.delete("/base_de_datos", homeController.borrar_base);
}

module.exports = router;
