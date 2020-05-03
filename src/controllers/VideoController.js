const _ = require("underscore");
const Video = require("../models/video");
const videoRepositorio = require("../repositorios/VideoRepositorio");

function obtenerErrores(video) {
  const errores = video.validateSync();
  if (errores) {
    var mapa = {};
    _.each(_.values(errores.errors), function (error) {
      mapa[error.path] = error.message;
    });
    return mapa;
  }
  return;
}

module.exports = {
  crear: (req, res) => {
    const video = new Video({ url: req.body.url, titulo: req.body.titulo });
    const errores = obtenerErrores(video);
    if (errores) {
      res.status(400).send({ errores: errores });
    } else {
      return videoRepositorio
        .guardar(video)
        .then(() => {
          res.status(200).send({});
        })
        .catch(() => {
          res.status(500).send({});
        });
    }
  },
};
