const Video = require("../models/video");
const controller = require("./Controller");

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

exports.mostrar = (req, res) => {
  const offset = req.query.offset;
  const cantidad = req.query.cantidad;
  Video.paginate({}, { offset: offset, limit: cantidad }).then((resultado) => {
    res.status(200).send(resultado.docs);
  });
};
