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
  descripcion: {
    type: String,
    default: "",
  },
  ubicacion: {
    type: String,
    default: "",
  },
  visibilidad: {
    type: String,
    enum: {
      values: ["publico", "privado"],
      message: "La visibilidad no es válida",
    },
    default: "publico",
  },
  time_stamp: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
