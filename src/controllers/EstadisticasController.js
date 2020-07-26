const Video = require("../models/video");
const { result } = require("underscore");
const logger = require("../logger").logger;

exports.historico = (req, res) => {
  Video.countDocuments().then((total) => {
    res.status(200).json({ total_videos: total });
  });
};
