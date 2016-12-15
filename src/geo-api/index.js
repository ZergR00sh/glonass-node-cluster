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
  manipulator.flushdb();
  if(process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-var
    var i = 0;
  }
  subscriber.on('message', function(channel, message) {
    console.log('message: ' + message);
    if (channel === CHANNEL.GEO_STATE) {
      try {
        // eslint-disable-next-line no-var
        var devices = JSON.parse(message);
      } catch(e) {
        devices = [];
        console.log('#geoApi(io): Parsing error!');
      }
      if(process.env.NODE_ENV === 'development') {
        let devicesInTime = require('./devices.json'); // fixtures
        console.log('emited');
        if(i == devicesInTime.length) io.emit('devices', {devices});
        else io.emit('devices', {devices: devicesInTime[i++]});
      } else {
        io.emit('devices', {devices});
      }
    }
  });

  subscriber.subscribe(CHANNEL.GEO_STATE);

  return function(socket) {
    console.log('started ' + socket.id);
    manipulator.incr(USERS_COUNT, utils.checkAddedSocketThenPub);
    socket.on('disconnect', () => {
      console.log('stoped ' + socket.id);
      manipulator.decr(USERS_COUNT, utils.checkRemovedSocketThenPub);
    });
  };
}

module.exports = geoApi;
