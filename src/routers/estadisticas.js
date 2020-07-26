const express = require("express");
const estadisticasController = require("../controllers/EstadisticasController");
const router = express.Router();
const config = require("../config");

router.get("/", estadisticasController.estadisticas);
router.get("/historico", estadisticasController.historico);

module.exports = router;
