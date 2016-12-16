/* eslint new-cap: [0, {capIsNewExceptions: ["S"]}] */
const server = require('http').Server();
const io = require('socket.io')(server);
const geoApi = require('./geo-api');

const nsp = io.of('/api');

nsp.on('connection', geoApi(nsp));

module.exports = server;
