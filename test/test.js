const chai = require("chai");
const sinon = require("sinon");
const homeController = require("../src/controllers/HomeController");

const expect = chai.expect;
const should = chai.should();

class MockResponse {
  constructor() {
    this.data = {};
  }

  status(status) {
    this.status = status;
    return this;
  }
  send(data) {
    this.data = data;
  }
}

describe("HomeController", function () {
  beforeEach(() => {
    response = new MockResponse();
  });

  it("debe responder 200 OK cuando llamo al ping", function () {
    homeController.ping({}, response);
    response.status.should.equal(200);
  });
});
