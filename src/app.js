/* eslint new-cap: [0, {capIsNewExceptions: ["S"]}] */
const server = require('http').Server();
const io = require('socket.io')(server);
const api = require('./api');

const nsp = io.of('/api');

nsp.on('connection', api(nsp));

module.exports = server;
