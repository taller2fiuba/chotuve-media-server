const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "El titulo es obligatorio"],
  },
  url: {
    type: String,
    required: [true, "La url del video es obligatoria"],
  },
  usuario_id: {
    type: Number,
    required: [true, "El id de usuario es obligatorio"],
    min: [1, "El id es inválido"],
  },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
