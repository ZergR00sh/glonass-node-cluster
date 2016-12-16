// eslint-disable-next-line no-unused-vars
const should = require('should');
const io = require('socket.io-client');
const PORT = 1337;
const socketURL = `http://0.0.0.0:${PORT}/api`;
const redisFactory = require('../src/db/redis-factory');
let redisClient1 = null;
let redisClient2 = null;
let redisClient3 = null;
const CHANNEL = require('../src/constants').CHANNEL;
const devices = ['devices'];
const fixture = JSON.stringify(devices);

describe('geoapi socket server', function() {
  let server;

  beforeEach(function() {
    server = require('../src/app');
    server.listen(PORT);
    redisClient1 = redisFactory();
    redisClient2 = redisFactory();
    redisClient3 = redisFactory();
    redisClient3.flushdb();
  });

  afterEach(function(done) {
    server.close();
    redisClient3.flushdb(() => {
      redisClient3.end(true);
      redisClient2.end(true);
      redisClient1.end(true);
      done();
    });
  });

  it('should connect to the server pub and retrive data', function(done) {
    this.timeout(10000);
    redisClient1.on('message', hasUsersHandler);
    redisClient1.subscribe(CHANNEL.HAS_USERS);

    let socket2 = io.connect(socketURL);
    let socket1 = io.connect(socketURL);
    let socket3 = io.connect(socketURL);

    socket1.on('devices', function(data) {
      should.exists(data.devices);
      setTimeout(() => {
        socket1.disconnect();
        done();
      }, 2000);
    });

    socket2.on('connect', function(data) {
      setTimeout(() => {
        socket2.disconnect();
      }, 1500);
    });

    socket3.on('connect', function(data) {
      setTimeout(() => {
        socket3.disconnect();
      }, 3000);
    });
  });
});

/**
 * glonass-node-geoapi-polling-server responses fixture
 * @param  {[type]}  channel [description]
 * @param  {[type]}  message [description]
 */
function hasUsersHandler(channel, message) {
    if(message === CHANNEL.MSGS.FIRST_USER_ARRIVED) {
      redisClient2.publish(CHANNEL.GEO_STATE, fixture);
    }
}
