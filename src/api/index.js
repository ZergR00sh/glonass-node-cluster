const subscriber = require('../db/redis-factory')();
const publisher = require('../db/redis-factory')();
const CHANNEL = require('../constants').CHANNEL;
const log = require('debug')('app-info');
const debug = require('debug')('debug');
let usersCount = 0;

/**
 * api middleware factory for socket.io application
 * @param  {Socket} io socket.io object
 * @return {Function} socket.io middleware
 */
function api(io) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-var
    var i = 0;
  }
  subscriber.on('message', function(channel, message) {
    debug('message: ' + message);
    if (channel === CHANNEL.GEO_STATE) {
      try {
        // eslint-disable-next-line no-var
        var devices = JSON.parse(message);
      } catch(e) {
        devices = [];
        log('#api(io): Parsing error!');
      }
      if (process.env.NODE_ENV === 'development') {
        let devicesInTime = require('./devices.json'); // fixtures
        debug('emited');
        if(i == devicesInTime.length) io.emit('devices', {devices});
        else io.emit('devices', {devices: devicesInTime[i++]});
      } else {
        io.emit('devices', {devices});
      }
    }
  });

  subscriber.subscribe(CHANNEL.GEO_STATE);

  return function(socket) {
    log('started ' + socket.id);
    if (usersCount++ === 0) {
      publisher.publish(CHANNEL.HAS_USERS, CHANNEL.MSGS.FIRST_USER_ARRIVED);
    }

    socket.on('disconnect', () => {
      log('stoped ' + socket.id);
      if (usersCount-- === 1) {
        publisher.publish(CHANNEL.HAS_USERS, CHANNEL.MSGS.LAST_USER_LEFT);
      }
    });
  };
}

module.exports = api;
