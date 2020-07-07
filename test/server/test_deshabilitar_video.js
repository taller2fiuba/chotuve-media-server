process.env.PORT = 27081;
const app = require("../../app");
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const server = chai.request.agent(`http://localhost:${process.env.PORT}`);
const Video = require("../../src/models/video");
const should = chai.should();

describe("Cambiar habilitacion de video", () => {
  beforeEach(function (done) {
    Video.remove({}, () => {
      done();
    });
  });

  it("deshabilito video", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
    });

    video.save().then(() => {
      server
        .put(`/video/${video._id}`)
        .send({
          habilitado: "false",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          Video.findById(video._id, (err, video_deshabilitado) => {
            expect(video_deshabilitado.habilitado).to.eq(false);
            done();
          });
        });
    });
  });

  it("habilito video", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
    });
    video.habilitado = false;
    video.save().then(() => {
      server
        .put(`/video/${video._id}`)
        .send({
          habilitado: "true",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          Video.findById(video._id, (err, video_habilitado) => {
            expect(video_habilitado.habilitado).to.eq(true);
            done();
          });
        });
    });
  });
});
