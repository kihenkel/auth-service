const express = require('express');

const sessions = require('./sessions');
const users = require('./users');

module.exports = () => {
  const api = new express.Router();

  api.use('/sessions', sessions());
  api.use('/users', users());

  return api;
}