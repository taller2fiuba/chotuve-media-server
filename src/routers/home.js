const express = require("express");
const homeController = require("../controllers/HomeController");
const router = express.Router();

router.get("/ping", homeController.ping);
if (process.env.NODE_ENV == "development") {
  router.get("/base_de_datos", homeController.borrar_base);
}

module.exports = router;
