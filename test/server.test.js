const request = require('supertest');

describe('express server', function() {
  let server;

  beforeEach(function() {
    server = require('../src/app');
  });

  afterEach(function(done) {
    server.close(function() {
      done();
    });
  });

  it('responds to /api', function testSlash(done) {
    this.timeout(10000);
    request(server)
      .get('/api')
      .expect(200, done);
  });

  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
