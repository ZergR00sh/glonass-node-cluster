const redisFactory = require('../src/db/redis-factory');
// eslint-disable-next-line no-unused-vars
const should = require('should');

describe('redis-factory suite', function() {
    it('should be defined', function() {
      redisFactory.should.be.instanceof(Function);
    });
    it('should return an object', function() {
      const client = redisFactory();
      client.should.be.instanceof(Object);
      client.end(true);
    });
    it('should perform communication with redis', function(done) {
      const client = redisFactory();
      client.set('key', 20, function(err, result) {
        result.should.equal('OK');
        client.end(true);
        done();
      });
    });
    it('should return pong on ping', function(done) {
      const client = redisFactory();
      client.ping(function(err, result) {
        result.should.equal('PONG');
        client.end(true);
        done();
      });
    });
});
