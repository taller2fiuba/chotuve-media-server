process.env.PORT = 27081;
const app = require("../../app");
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const server = chai.request(`http://localhost:${process.env.PORT}`);
const Video = require("../../src/models/video");

describe("EstadisticasController", () => {
  beforeEach(function (done) {
    Video.remove({}, () => {
      done();
    });
  });

  it("debe responder total_videos es cero cuando consulto histórico ", (done) => {
    server.get("/stats/historico").end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.body["total_videos"]).to.eq(0);
      done();
    });
  });

  it("debe dar error cuando se consulta estádisticas sin fecha inicio", (done) => {
    server.get("/stats").end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res.body.error).to.eq("fecha inicio es obligatorio");
      done();
    });
  });

  it("debe dar error cuando se consulta estádisticas sin fecha fin", (done) => {
    server.get("/stats?inicio=2020-12-01").end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res.body.error).to.eq("fecha fin es obligatorio");
      done();
    });
  });

  it("debe dar error cuando se consulta estádisticas con fecha inicio mayor a fecha fin", (done) => {
    server
      .get("/stats?inicio=2020-12-10&fin=2020-12-01")
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res.body.error).to.eq(
          "fecha inicio tiene que ser menor o igual a la fecha fin"
        );
        done();
      });
  });

  it("debe dar correcto cuando se consulta estádisticas con fecha inicio igual a fecha fin", (done) => {
    server
      .get("/stats?inicio=2020-12-10&fin=2020-12-10")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.eql({
          "2020-12-10": 0,
        });
        done();
      });
  });

  it("debe dar cero videos por día cuando no hay videos cuando consulto estadísticas", (done) => {
    server
      .get("/stats?inicio=2020-12-10&fin=2020-12-13")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.eql({
          "2020-12-10": 0,
          "2020-12-11": 0,
          "2020-12-12": 0,
          "2020-12-13": 0,
        });
        done();
      });
  });

  it("debe dar la cantidad de videos por día  cuando consulto estadísticas y hay videos", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
    });

    video.save().then(() => {
      const fecha = video.time_stamp.toISOString().split("T")[0];
      server.get(`/stats?inicio=${fecha}&fin=${fecha}`).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.eql({ [fecha]: 1 });
        done();
      });
    });
  });

  it("debe dar la cantidad total de videos cuando consulto histórico y hay videos", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
    });

    video.save().then(() => {
      server.get("/stats/historico").end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body["total_videos"]).to.eq(1);
        done();
      });
    });
  });
});
