process.env.PORT = 27081;
const app = require("../../app");
let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const server = chai.request(`http://localhost:${process.env.PORT}`);

describe("HomeController", () => {
  it("debe responder 200 OK cuando llamo al ping", (done) => {
    server.get("/ping").end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  it("debe responder 200 OK cuando llamo  a base_de_datos", (done) => {
    server.delete("/base_de_datos").end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});
