const Video = require("../models/video");
const { result } = require("underscore");
const logger = require("../logger").logger;

exports.estadisticas = (req, res) => {
  if (!req.query.inicio) {
    res.status(400).json({ error: "fecha inicio es obligatorio" });
  }
  if (!req.query.fin) {
    res.status(400).json({ error: "fecha fin es obligatorio" });
  }

  const fecha_inicio = new Date(req.query.inicio);
  const fecha_fin = new Date(req.query.fin);
  if (fecha_inicio > fecha_fin) {
    res.status(400).json({
      error: "fecha inicio tiene que ser menor o igual a la fecha fin",
    });
  }

  fecha_fin.setDate(fecha_fin.getDate() + 1);

  Video.aggregate(
    [
      {
        $match: {
          time_stamp: {
            $gte: fecha_inicio,
            $lte: fecha_fin,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time_stamp" } },
          total: {
            $sum: 1,
          },
        },
      },
    ],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(armarEstadisticas(result, fecha_inicio, fecha_fin));
      }
    }
  );
};

exports.historico = (req, res) => {
  Video.countDocuments().then((total) => {
    res.status(200).json({ total_videos: total });
  });
};

const armarEstadisticas = (result, fecha_inicio, fecha_fin) => {
  let estadisticas = result.map((value) => {
    return { [value._id]: value.total };
  });

  estadisticas = Object.assign({}, ...estadisticas);

  const resultado = {};
  while (fecha_inicio < fecha_fin) {
    let fecha = fecha_inicio.toISOString().split("T")[0];
    resultado[fecha] = !estadisticas[fecha] ? 0 : estadisticas[fecha];
    fecha_inicio.setDate(fecha_inicio.getDate() + 1);
  }

  return resultado;
};
