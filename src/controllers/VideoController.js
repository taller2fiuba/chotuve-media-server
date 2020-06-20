const Video = require("../models/video");
const controller = require("./Controller");

const OFFSET_POR_DEFECTO = 0;
const CANTIDAD_POR_DEFECTO = 10;
const HABILITACION_POR_DEFECTO = true

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
  const solo_habilitados = req.query.solo_habilitados ? req.query.solo_habilitados : HABILITACION_POR_DEFECTO;  
  Video.paginate({"habilitado": solo_habilitados}, { offset: offset, limit: cantidad }).then((resultado) => {
    res.status(200).json(resultado.docs);
  });
};

exports.obtener_por_id = (req, res) => {
  const id = req.params.id;
  Video.findById(id, (err, video) => {
    if (err) return res.status(404).json({});
    res.status(200).json(video);
  });
};

exports.cambiar_habilitacion = (req, res) => {
  const id = req.params.id;
  Video.findById(id, (err, video) => {
    if (err) return res.status(404).json({});
    video.habilitado = req.body.habilitado;
    video.save();
    res.status(200).json(video);
  });
};
