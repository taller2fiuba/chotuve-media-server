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
    let stubGuardar = sinon
      .stub(videoRepositorio, "guardar")
      .returns(Promise.resolve());
    videoController
      .crear(
        { url: "https://urltest.com/video/1", titulo: "video test" },
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
    let stubGuardar = sinon
      .stub(videoRepositorio, "guardar")
      .returns(Promise.reject());
    videoController
      .crear(
        { url: "https://urltest.com/video/1", titulo: "video test" },
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
    videoController.crear({ url: "", titulo: "Sin url" }, response);
    response.status.should.equal(400);
    response.data.mensaje.should.equal("La url del video es obligatoria");
  });

  it("debe responder 400 cuando creo un nuevo video sin titulo", () => {
    videoController.crear(
      { url: "https://urltest.com/video/1", titulo: "" },
      response
    );
    response.status.should.equal(400);
    response.data.mensaje.should.equal("El titulo es obligatorio");
  });
});
