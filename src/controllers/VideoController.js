const Video = require("../models/video");
const videoRepositorio = require("../repositorios/VideoRepositorio");

module.exports = {
  crear: (req, res) => {
    const video = new Video({ url: req.body.url, titulo: req.body.titulo });
    const error = video.validateSync();
    if (error && error.errors && error.errors["titulo"]) {
      res.status(400).send({ mensaje: error.errors["titulo"].message });
    } else if (error && error.errors && error.errors["url"]) {
      res.status(400).send({ mensaje: error.errors["url"].message });
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
