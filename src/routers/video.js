const express = require("express");
const videoController = require("../controllers/VideoController");
const router = express.Router();

router.post("/", videoController.crear);
router.get("/", videoController.obtener);
router.get("/:id", videoController.obtener_por_id);

module.exports = router;
