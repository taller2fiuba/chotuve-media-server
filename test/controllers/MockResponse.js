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

module.exports = MockResponse;
