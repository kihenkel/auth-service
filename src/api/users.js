const express = require('express');
const logger = require('./../logger');
const userService = require('./../services/userService');

module.exports = () => {
  const api = new express.Router();
  
  api.post('/new/:username/:password', async (req, res) => {
    logger.info(`Creating new user ${req.params.username}`);
    try {
      await userService.createUser(req.params.username, req.params.password);
      res.status(201).send();
    } catch (error) {
      logger.error(`Error while creating new user ${req.params.username}`, error);
      res.status(400).send({ message: 'Error while creating new user' });
    }
  });

  api.get('/authenticate/:username/:password', async (req, res) => {
    logger.info(`Authenticating user ${req.params.username}`);
    try {
      const authenticated = await userService.authenticate(req.params.username, req.params.password);
      res.status(200).send({ result: authenticated ? 'OK' : 'NOK'});
    } catch (error) {
      logger.error(`Error while authenticating user ${req.params.username}`, error);
      res.status(400).send({ message: 'Error while authenticating user' });
    }
  });

  api.post('/change/password/:username/:password', async (req, res) => {
    logger.info(`Changing password for user ${req.params.username}`);
    try {
      await userService.changePassword(req.params.username, req.params.password);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error while changing password for user ${req.params.username}`, error);
      res.status(400).send({ message: 'Error while changing password' });
    }
  });

  api.delete('/:username', async (req, res) => {
    logger.info(`Deleting user ${req.params.username}`);
    try {
      await userService.deleteUser(req.params.username);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error while deleting user ${req.params.username}`, error);
      res.status(400).send({ message: 'Error while deleting user' });
    }
  });

  return api;
}