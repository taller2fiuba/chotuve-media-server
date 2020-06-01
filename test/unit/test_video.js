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

  it("debe responder 500 cuando creo un nuevo video bien pero la base de datos falla", () => {
    let stubGuardar = sinon.stub(videoRepositorio, "guardar").rejects();
    videoController
      .crear(
        {
          body: {
            url: "https://urltest.com/video/1",
            titulo: "video test",
            usuario_id: 1,
            duracion: 60,
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
});
