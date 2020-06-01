process.env.PORT = 27081;
const app = require("../../app");
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const server = chai.request.agent(`http://localhost:${process.env.PORT}`);

const should = chai.should();

describe("VideoController", () => {
  it("debe responder 201 creo un nuevo video correctamente", (done) => {
    server
      .post("/video")
      .send({
        url: "https://urltest.com/video/1",
        titulo: "video test",
        usuario_id: 1,
        duracion: 60,
      })
      .end(function (err, res) {
        expect(res).to.have.status(201);
        done();
      });
  });

  it("debe responder 400 cuando creo un nuevo video sin url", (done) => {
    server
      .post("/video")
      .send({
        url: "",
        titulo: "Sin url",
        usuario_id: 1,
        duracion: 60,
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        res.body.errores.url.should.equal("La url del video es obligatoria");
        done();
      });
  });

  it("debe responder 400 cuando creo un nuevo video sin titulo", (done) => {
    server
      .post("/video")
      .send({
        url: "https://urltest.com/video/1",
        titulo: "",
        usuario_id: 1,
        duracion: 60,
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        res.body.errores.titulo.should.equal("El titulo es obligatorio");
        done();
      });
  });

  it("debe responder 400 cuando creo un nuevo video sin usuario_id", (done) => {
    server
      .post("/video")
      .send({
        url: "https://urltest.com/video/1",
        titulo: "video test",
        duracion: 60,
        usuario_id: null,
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        res.body.errores.usuario_id.should.equal(
          "El id de usuario es obligatorio"
        );
        done();
      });
  });

  it("debe responder 400 cuando creo un nuevo video con usuario_id inválido", (done) => {
    server
      .post("/video")
      .send({
        url: "https://urltest.com/video/1",
        titulo: "video test",
        duracion: 0,
        usuario_id: 0,
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        res.body.errores.usuario_id.should.equal("El id es inválido");
        done();
      });
  });

  it("debe responder 400 cuando creo un nuevo video con visiblidad inválida", (done) => {
    server
      .post("/video")
      .send({
        url: "https://urltest.com/video/1",
        titulo: "video test",
        usuario_id: 1,
        duracion: 60,
        visibilidad: "solo amigos",
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        res.body.errores.visibilidad.should.equal(
          "La visibilidad no es válida"
        );
        done();
      });
  });

  it("debe responder 400 cuando creo un nuevo video con duracion inválida", (done) => {
    server
      .post("/video")
      .send({
        url: "https://urltest.com/video/1",
        titulo: "video test",
        usuario_id: 1,
        duracion: 0,
        visibilidad: "privado",
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        res.body.errores.duracion.should.equal("La duración no es válida");
        done();
      });
  });

  it("debe responder 400 cuando creo un nuevo video sin duracion", (done) => {
    server
      .post("/video")
      .send({
        url: "https://urltest.com/video/1",
        titulo: "video test",
        usuario_id: 1,
        visibilidad: "publico",
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        res.body.errores.duracion.should.equal("La duración es obligatoria");
        done();
      });
  });
});
