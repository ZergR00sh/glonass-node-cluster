const redis = require('redis');
const client1 = require('../db/redis-factory')();
const client2 = require('../db/redis-factory')();
const CHANNEL = require('../constants').CHANNEL;
const USERS_COUNT = require('../constants').USERS_COUNT;

/**
 * [geoApi description]
 * @param  {[type]} io [description]
 * @return {Function} socket.io middleware
 */
function geoApi(io) {
  client1.on('message', function(channel, message) {
    if (channel === CHANNEL.GEO_STATE) {
      try {
        // eslint-disable-next-line no-var
        var devicesCoords = JSON.parse(message);
      } catch(e) {
        console.log('#geoApi(io): Parsing error!');
      }
      io.emit('devices-coords', {devicesCoords});
    }
  });

  client1.subscribe(CHANNEL.GEO_STATE);

  return function(socket) {
    client1.get(USERS_COUNT, checkAddedSocketThenPub);
    socket.on('disconnect', function() {
      client1.get(USERS_COUNT, checkRemovedSocketThenPub);
    });
  };
}

/**
 * [checkAddedSocketThenPub description]
 * @param  {[type]} err [description]
 * @param  {[type]} res [description]
 */
function checkAddedSocketThenPub(err, res) {
  if(parseInt(res) == 0) {
    client2.publish(CHANNEL.HAS_USERS, 'true', redis.print);
  }
  client2.incr(USERS_COUNT);
}

/**
 * [checkRemovedSocketThenPub description]
 * @param  {[type]} err [description]
 * @param  {[type]} res [description]
 */
function checkRemovedSocketThenPub(err, res) {
  if(parseInt(res) == 1) {
    client2.publish(CHANNEL.HAS_USERS, 'false', redis.print);
  }
  client2.decr(USERS_COUNT);
}

module.exports = geoApi;
