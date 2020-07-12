const Video = require("../models/video");
const controller = require("./Controller");
const logger = require("../logger").logger;

const OFFSET_POR_DEFECTO = 0;
const CANTIDAD_POR_DEFECTO = 10;

exports.crear = (req, res) => {
  const video = new Video({
    url: req.body.url,
    titulo: req.body.titulo,
    usuario_id: req.body.usuario_id,
    descripcion: req.body.descripcion,
    ubicacion: req.body.ubicacion,
    visibilidad: req.body.visibilidad,
    duracion: req.body.duracion,
  });
  const errores = controller.responderErrores(res, video);
  if (!errores) {
    video.save().then(() => {
      res.status(201).send({});
    });
  }
};

exports.obtener = (req, res) => {
  const offset = req.query.offset ? req.query.offset : OFFSET_POR_DEFECTO;
  const cantidad = req.query.cantidad
    ? req.query.cantidad
    : CANTIDAD_POR_DEFECTO;

  let filter_param = {};
  if (
    req.query.solo_habilitados === "true" ||
    !req.query.hasOwnProperty("solo_habilitados")
  ) {
    filter_param["habilitado"] = true;
  }
  if (req.query.usuario_id) {
    filter_param["usuario_id"] = req.query.usuario_id;
  }
  if (req.body.hasOwnProperty("contactos")) {
    filter_param["visibilidad"] = "publico";
    filter_param = {
      $or: [
        {
          usuario_id: {
            $in: req.body.contactos,
          },
          habilitado: true,
        },
        filter_param,
      ],
    };
  }
  Video.paginate(filter_param, { offset: offset, limit: cantidad }).then(
    (resultado) => {
      let response = {
        videos: resultado.docs,
        total: resultado.totalDocs,
      };
      res.status(200).json(response);
    }
  );
};

exports.obtener_por_id = (req, res) => {
  const id = req.params.id;
  Video.findById(id, (err, video) => {
    if (err) return res.status(404).json({});
    res.status(200).json(video);
  });
};

exports.actualizar_video = (req, res) => {
  const id = req.params.id;
  Video.findById(id, (err, video) => {
    if (err) return res.status(404).json({});
    if (req.body.hasOwnProperty("habilitado")) {
      video.habilitado = req.body.habilitado;
    }
    video.titulo = req.body.titulo ? req.body.titulo : video.titulo;
    video.descripcion = req.body.descripcion
      ? req.body.descripcion
      : video.descripcion;
    video.ubicacion = req.body.ubicacion ? req.body.ubicacion : video.ubicacion;
    video.visibilidad = req.body.visibilidad
      ? req.body.visibilidad
      : video.visibilidad;

    video.save().then(() => {
      res.status(200).json(video);
    });
  });
};
