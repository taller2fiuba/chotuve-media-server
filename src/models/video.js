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
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
