const USERS_COUNT = 'USERS_COUNT';

const HAS_USERS_CHANNEL = process.env.REDIS_GEOAPI_POLL || 'HAS_USERS_CHANNEL';
const GEO_STATE_CHANNEL = process.env.GEO_STATE_CHANNEL || 'GEO_STATE_CHANNEL';

const REDIS_HOST = process.env.REDIS_HOST || 'redis.db';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

module.exports = {
  REDIS: {
    HOST: REDIS_HOST,
    PORT: REDIS_PORT,
  },
  CHANNEL: {
    HAS_USERS: HAS_USERS_CHANNEL,
    GEO_STATE: GEO_STATE_CHANNEL,
  },
  USERS_COUNT,
};