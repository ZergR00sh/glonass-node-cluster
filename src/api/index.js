const express = require('express');
/* eslint new-cap: [2, {capIsNewExceptions: ["S"]}] */
const api = new express.Router();

api.get('/', (req, res) => res.json({api: true}));

module.exports = api;
