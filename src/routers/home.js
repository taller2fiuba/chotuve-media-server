const express = require("express");
const homeController = require("../controllers/HomeController");
const router = express.Router();

router.get("/ping", homeController.ping);

module.exports = router;
