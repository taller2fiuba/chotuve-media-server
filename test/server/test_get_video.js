process.env.PORT = 27081;
const app = require("../../app");
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const server = chai.request.agent(`http://localhost:${process.env.PORT}`);
const Video = require("../../src/models/video");
const should = chai.should();

describe("Obtener video", () => {
  beforeEach(function (done) {
    Video.remove({}, () => {
      done();
    });
  });

  it("debe responder 200 y lista vacía si no hay videos", (done) => {
    server.get("/video").end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.body.length).to.eq(0);
      done();
    });
  });

  it("get videos sin parametros obtiene videos si hay", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
    });

    video.save().then(() => {
      server.get("/video").end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eq(1);
        done();
      });
    });
  });

  it("get videos con parametros obtiene videos", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
    });

    video.save().then(() => {
      server.get("/video?offset=0&cantidad=10").end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eq(1);
        done();
      });
    });
  });

  it("get videos con parametros fuera de rango no obtiene videos", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
    });

    video.save().then(() => {
      server.get("/video?offset=10&cantidad=10").end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eq(0);
        done();
      });
    });
  });

  it("get video con id inexistente devuelve 404", (done) => {
    server.get("/video/klasdpo79da9d").end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.eql({});
      done();
    });
  });

  it("get video con id correcto obtiene video", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
    });

    video.save().then(() => {
      server.get(`/video/${video._id}`).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body["_id"]).to.eq(`${video._id}`);
        done();
      });
    });
  });
});
