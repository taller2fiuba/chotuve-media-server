const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
  duracion: {
    type: Number,
    required: [true, "La duración es obligatoria"],
    min: [1, "La duración no es válida"],
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
  habilitado: {
    type: Boolean,
    default: true,
  },
});

videoSchema.plugin(mongoosePaginate);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
