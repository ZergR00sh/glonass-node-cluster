const redis = require('redis');
const client1 = require('../db/redis-factory')();
const client2 = require('../db/redis-factory')();
const client3 = require('../db/redis-factory')();
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
      console.log('geoAPI');
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
    console.log('client id is: ' + socket.id);
    client3.incr(USERS_COUNT, checkAddedSocketThenPub);
    socket.on('disconnect', function() {
      client3.decr(USERS_COUNT, checkRemovedSocketThenPub);
    });
  };
}

/**
 * [checkAddedSocketThenPub description]
 * @param  {[type]} err [description]
 * @param  {[type]} res [description]
 * @return  {Boolean} result
 */
function checkAddedSocketThenPub(err, res) {
  let prev = res - 1;
  if(err) {
    console.log('#checkAddedSocketThenPub: ' + err);
    return false;
  }
  if(prev === 0) {
    console.log('publish to CHANNEL.HAS_USERS true ', res);
    client2.publish(CHANNEL.HAS_USERS, 'true', redis.print);
  }
}

/**
 * [checkRemovedSocketThenPub description]
 * @param  {[type]} err [description]
 * @param  {[type]} res [description]
 * @return  {Boolean} result
 */
function checkRemovedSocketThenPub(err, res) {
  let prev = res + 1;
    console.log('disconnected');
  if(err) {
    console.log('#checkAddedSocketThenPub: ' + err);
    return false;
  }
  if(prev == 1) {
    console.log('publish to CHANNEL.HAS_USERS false ', res);
    client2.publish(CHANNEL.HAS_USERS, 'false', redis.print);
  }
}

module.exports = geoApi;
