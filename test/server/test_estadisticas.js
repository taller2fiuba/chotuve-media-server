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

  it("debe dar error cuando se consulta estádisticas sin inicio", (done) => {
    server.get("/stats").end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res.body.error).to.eq("fecha inicio es obligatorio");
      done();
    });
  });

  it("debe dar error cuando se consulta estádisticas sin fin", (done) => {
    server.get("/stats?inicio=2020-12-01").end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res.body.error).to.eq("fecha fin es obligatorio");
      done();
    });
  });
});
