// eslint-disable-next-line no-unused-vars
const should = require('should');
const redisFactory = require('../src/db/redis-factory');
const utils = require('../src/geo-api/utils');
const CHANNEL = require('../src/constants').CHANNEL;

describe('utils suite', function() {
  let client;

  beforeEach(function() {
    client = redisFactory();
  });

  afterEach(function(done) {
    client.flushdb(function() {
      client.end(true);
      done();
    });
  });

  describe('#checkAddedSocketThenPub suite', function() {
    it('should publish to has_users channel if prev value 0', function() {
      client.on('message', function(channel, result) {
        channel.should.be.equal(CHANNEL.HAS_USERS);
        result.should.be.equal('true');
      });
      client.subscribe(CHANNEL.HAS_USERS);
      utils.checkRemovedSocketThenPub(null, '1');
    });
  });

  describe('#checkRemovedSocketThenPub suite', function() {
    it('should publish to has_users channel if prev value 0', function() {
      client.on('message', function(channel, result) {
        channel.should.be.equal(CHANNEL.HAS_USERS);
        result.should.be.equal('false');
      });
      client.subscribe(CHANNEL.HAS_USERS);
      utils.checkRemovedSocketThenPub(null, '0');
    });
  });
});
