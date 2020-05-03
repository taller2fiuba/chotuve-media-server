const Video = require("../models/video");
const controller = require("./Controller");
const videoRepositorio = require("../repositorios/VideoRepositorio");

exports.crear = (req, res) => {
  const video = new Video({ url: req.body.url, titulo: req.body.titulo });
  const errores = controller.responderErrores(res, video);
  if (!errores) {
    return videoRepositorio
      .guardar(video)
      .then(() => {
        res.status(201).send({});
      })
      .catch(() => {
        res.status(500).send({});
      });
  }
};
