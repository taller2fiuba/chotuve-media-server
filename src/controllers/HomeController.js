const mongoose = require("mongoose");

module.exports = {
  ping: (req, res) => {
    res.status(200).send({});
  },
  borrar_base: (req, res) => {
    mongoose.connection.dropDatabase((error) => {
      if (!error) {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    });
  },
};
