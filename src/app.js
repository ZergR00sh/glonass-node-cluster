const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const REDIS = require('./constants').REDIS;
const api = require('./api');
const geoapi = require('./geoapi');

const app = express();
/* eslint new-cap: [0, {capIsNewExceptions: ["S"]}] */
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.adapter(require('socket.io-redis')({
  host: REDIS.HOST,
  port: REDIS.PORT,
}));

app.set('trust proxy', 1);

app.use(logger('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: false}))
  .use(cookieParser());

if(process.env.NODE_ENV === 'production') {
  app.disable('x-powered-by');
  app.use(helmet())
    .use(compression());
}

app.use('/api', api);

io.on('connection', geoapi(io));

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500)
    .send(res.locals.message);
});

module.exports = server;
