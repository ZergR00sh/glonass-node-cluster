const publisher = require('../db/redis-factory')();
const CHANNEL = require('../constants').CHANNEL;

/**
 * Checks added socket in redis and if prev count
 * is 0 publish true (start event) to redis
 * then glonass-node-polling server start poll
 * requesting session
 * @param  {Error} err possible error
 * @param  {String} res quering result
 */
function checkAddedSocketThenPub(err, res) {
  let prev = res - 1;
  if(err) {
    console.error(err);
    return;
  } else if(prev === 0) {
    publisher.publish(CHANNEL.HAS_USERS, 'true');
  }
}

/**
 * Checks removed socket in redis and if prev count
 * is 1 publish false (stop event) to redis
 * then glonass-node-polling server stop poll
 * requesting session
 * @param  {Error} err possible error
 * @param  {String} res quering result
 */
function checkRemovedSocketThenPub(err, res) {
  let prev = res + 1;
  if(err) {
    console.error(err);
    return;
  } else if(prev == 1) {
    publisher.publish(CHANNEL.HAS_USERS, 'false');
  }
}

module.exports = {
  checkAddedSocketThenPub,
  checkRemovedSocketThenPub,
};
