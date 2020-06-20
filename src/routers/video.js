const express = require("express");
const videoController = require("../controllers/VideoController");
const router = express.Router();

router.post("/", videoController.crear);
router.get("/", videoController.obtener);
router.get("/:id", videoController.obtener_por_id);
router.put("/:id", videoController.cambiar_habilitacion);

module.exports = router;
