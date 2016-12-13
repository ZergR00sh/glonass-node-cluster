const redis = require('redis');
const subscriber = require('../db/redis-factory')();
const manipulator = require('../db/redis-factory')();
const utils = require('./utils');
const CHANNEL = require('../constants').CHANNEL;
const USERS_COUNT = require('../constants').USERS_COUNT;

/**
 * GeoAPI middleware factory
 * @param  {Socket} io socket.io object
 * @return {Function} socket.io middleware
 */
function geoApi(io) {
  subscriber.on('message', function(channel, message) {
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

  subscriber.subscribe(CHANNEL.GEO_STATE);

  return function(socket) {
    manipulator.incr(USERS_COUNT, utils.checkAddedSocketThenPub);

    socket.on('disconnect', function() {
      manipulator.decr(USERS_COUNT, utils.checkRemovedSocketThenPub);
    });
  };
}

module.exports = geoApi;
