const _ = require("underscore");

exports.responderErrores = (res, modelo) => {
  const errores = modelo.validateSync();
  if (errores) {
    var mapa = {};
    _.each(_.values(errores.errors), function (error) {
      mapa[error.path] = error.message;
    });
    res.status(400).send({ errores: mapa });
    return mapa;
  }
};
