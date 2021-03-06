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
      expect(res.body["videos"].length).to.eq(0);
      expect(res.body["total"]).to.eq(0);
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
        expect(res.body["videos"].length).to.eq(1);
        expect(res.body["total"]).to.eq(1);
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
        expect(res.body["videos"].length).to.eq(1);
        expect(res.body["total"]).to.eq(1);
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
        expect(res.body["videos"].length).to.eq(0);
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

  it("get video con solo_habilitados false obtiene todos los videos", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
    });

    video.save().then(() => {
      server.get(`/video/?solo_habilitados=false`).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body["videos"].length).to.eq(1);
        expect(res.body["total"]).to.eq(1);
        done();
      });
    });
  });

  it("get video con solo_habilitados false obtiene video deshabilitado", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
      habilitado: false,
    });

    video.save().then(() => {
      const video2 = new Video({
        url: "url/test",
        titulo: "video test",
        usuario_id: 1,
        duracion: 60,
      });
      video2.save().then(() => {
        server.get(`/video/?solo_habilitados=false`).end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body["videos"].length).to.eq(2);
          expect(res.body["total"]).to.eq(2);
          expect(res.body["videos"][1]["habilitado"]).to.eq(false);
          done();
        });
      });
    });
  });

  it("get video con solo_habilitados true no obtiene video deshabilitado", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
      habilitado: false,
    });

    video.save().then(() => {
      const video2 = new Video({
        url: "url/test",
        titulo: "video test",
        usuario_id: 1,
        duracion: 60,
      });
      video2.save().then(() => {
        server.get(`/video/?solo_habilitados=true`).end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body["videos"].length).to.eq(1);
          expect(res.body["total"]).to.eq(1);
          expect(res.body["videos"][0]["habilitado"]).to.eq(true);
          done();
        });
      });
    });
  });

  it("get video de un usuario sin videos no devuelve devuelve nada", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 2,
      duracion: 60,
      habilitado: false,
    });
    video.save().then(() => {
      server.get(`/video/?usuario_id=1`).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body["videos"].length).to.eq(0);
        expect(res.body["total"]).to.eq(0);
        done();
      });
    });
  });

  it("get video de un usuario con un videos devuelve el video", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
      habilitado: true,
    });
    video.save().then(() => {
      server.get(`/video/?usuario_id=1`).end((err, res) => {
        expect(res.body["videos"].length).to.eq(1);
        expect(res.body["total"]).to.eq(1);
        done();
      });
    });
  });

  it("get video de un usuario con video privado sin ser amigo devuelve vacio", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
      habilitado: true,
      visibilidad: "privado",
    });
    video.save().then(() => {
      server.get(`/video/?usuario_id=1&contactos[]`).end((err, res) => {
        expect(res.body["videos"].length).to.eq(0);
        expect(res.body["total"]).to.eq(0);
        done();
      });
    });
  });

  it("get video de un usuario con video privado siendo amigo devuelve el video", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
      habilitado: true,
      visibilidad: "privado",
    });
    video.save().then(() => {
      server.get(`/video/?usuario_id=1&contactos[]=1`).end((err, res) => {
        expect(res.body["videos"].length).to.eq(1);
        expect(res.body["total"]).to.eq(1);
        done();
      });
    });
  });

  it("get video de un usuario con video privado y uno publico siendo amigo devuelve los dos video", (done) => {
    const video_privado = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
      habilitado: true,
      visibilidad: "privado",
    });

    const video_publico = new Video({
      url: "url/test2",
      titulo: "video test2",
      usuario_id: 1,
      duracion: 60,
      habilitado: true,
      visibilidad: "publico",
    });
    video_privado.save().then(() => {
      video_publico.save().then(() => {
        server.get(`/video/?usuario_id=1&contactos[]=1`).end((err, res) => {
          expect(res.body["videos"].length).to.eq(2);
          expect(res.body["total"]).to.eq(2);
          done();
        });
      });
    });
  });

  it("get video de un usuario con video privado e inhabilitado siendo amigo devuelve vacio", (done) => {
    const video = new Video({
      url: "url/test",
      titulo: "video test",
      usuario_id: 1,
      duracion: 60,
      habilitado: true,
      visibilidad: "privado",
      habilitado: false,
    });
    video.save().then(() => {
      server.get(`/video/?usuario_id=1&contactos[]=1`).end((err, res) => {
        expect(res.body["videos"].length).to.eq(0);
        expect(res.body["total"]).to.eq(0);
        done();
      });
    });
  });
});
