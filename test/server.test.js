const request = require('supertest');

describe('express server', function() {
  let server;

  beforeEach(function() {
    server = require('../src/app');
  });

  afterEach(function() {
    server.close();
  });

  it('responds to /api', function testSlash(done) {
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
