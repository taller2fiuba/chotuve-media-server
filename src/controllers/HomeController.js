const mongosse = require("mongoose");

module.exports = {
  ping: (req, res) => {
    res.status(200).send({});
  },
  borrar_base: (req, res) => {
    mongosse.connection.db
      .dropDatabase()
      .then(res.status(200).send({}))
      .catch(res.status(500).send({}));
  },
};
