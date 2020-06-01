const express = require("express");
const videoController = require("../controllers/VideoController");
const router = express.Router();

router.post("/", videoController.crear);
router.get("/", videoController.obtener);

module.exports = router;
