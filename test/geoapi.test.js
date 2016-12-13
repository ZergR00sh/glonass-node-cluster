const io = require('socket.io-client');
const PORT = 1337;
const socketURL = `http://0.0.0.0:${PORT}`;
// eslint-disable-next-line no-unused-vars
const should = require('should');

describe('express server', function() {
  let server;

  before(function() {
    server = require('../src/app');
    server.listen(PORT);
  });

  after(function() {
    server.close();
  });

  it('should connect to the server and can be disconnected', function(done) {
    this.timeout(10000);
    let socket = io.connect(socketURL);

    socket.on('connect', function() {
      socket.disconnect();
    });

    socket.on('disconnect', function() {
      done();
    });
  });
});
