const chai = require("chai");
const sinon = require("sinon");
const videoController = require("../../src/controllers/VideoController");
const videoRepositorio = require("../../src/repositorios/VideoRepositorio");
const MockResponse = require("./MockResponse");

const expect = chai.expect;
const should = chai.should();

describe("VideoController", () => {
  beforeEach(() => {
    response = new MockResponse();
  });

  it("debe responder 200 creo un nuevo video correctamente", () => {
    let stubGuardar = sinon.stub(videoRepositorio, "guardar").resolves();
    videoController
      .crear(
        {
          body: {
            url: "https://urltest.com/video/1",
            titulo: "video test",
            usuario_id: 1,
          },
        },
        response
      )
      .then(() => {
        response.status.should.equal(200);
      })
      .finally(() => {
        stubGuardar.restore();
      });
  });

  it("debe responder 500 cuando creo un nuevo video bien pero la base de datos falla", () => {
    let stubGuardar = sinon.stub(videoRepositorio, "guardar").rejects();
    videoController
      .crear(
        {
          body: {
            url: "https://urltest.com/video/1",
            titulo: "video test",
            usuario_id: 1,
          },
        },
        response
      )
      .then(() => {
        response.status.should.equal(500);
      })
      .finally(() => {
        stubGuardar.restore();
      });
  });

  it("debe responder 400 cuando creo un nuevo video sin url", () => {
    videoController.crear(
      { body: { url: "", titulo: "Sin url", usuario_id: 1 } },
      response
    );
    response.status.should.equal(400);
    response.data.errores.url.should.equal("La url del video es obligatoria");
  });

  it("debe responder 400 cuando creo un nuevo video sin titulo", () => {
    videoController.crear(
      {
        body: { url: "https://urltest.com/video/1", titulo: "", usuario_id: 1 },
      },
      response
    );
    response.status.should.equal(400);
    response.data.errores.titulo.should.equal("El titulo es obligatorio");
  });

  it("debe responder 400 cuando creo un nuevo video sin usuario_id", () => {
    videoController.crear(
      {
        body: {
          url: "https://urltest.com/video/1",
          titulo: "video test",
          usuario_id: null,
        },
      },
      response
    );
    response.status.should.equal(400);
    response.data.errores.usuario_id.should.equal(
      "El id de usuario es obligatorio"
    );
  });

  it("debe responder 400 cuando creo un nuevo video con usuario_id inválido", () => {
    videoController.crear(
      {
        body: {
          url: "https://urltest.com/video/1",
          titulo: "video test",
          usuario_id: 0,
        },
      },
      response
    );
    response.status.should.equal(400);
    response.data.errores.usuario_id.should.equal("El id es inválido");
  });

  it("debe responder 400 cuando creo un nuevo video con con visiblidad inválida", () => {
    videoController.crear(
      {
        body: {
          url: "https://urltest.com/video/1",
          titulo: "video test",
          usuario_id: 1,
          visibilidad: "solo amigos",
        },
      },
      response
    );
    response.status.should.equal(400);
    response.data.errores.visibilidad.should.equal(
      "La visibilidad no es válida"
    );
  });
});
