const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./../logger');

const sessionService = require('./../services/sessionService');

module.exports = () => {
  const api = new express.Router();

  api.use(bodyParser.json());
  
  api.post('/authenticate/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const { accessToken, refreshToken } = req.body;
    logger.info(`Authenticating session ${sessionId}`);
    try {
      const authResult = await sessionService.authenticate(sessionId, accessToken, refreshToken);
      res.status(200).send({ result: authResult });
    } catch (error) {
      logger.error(`Error while authenticating session ${sessionId}`, error);
      res.status(400).send({ message: 'Error while authenticating session' });
    }
  });
  
  api.post('/new', async (req, res) => {
    logger.info('Creating new session');
    try {
      const result = await sessionService.createSession();
      res.status(201).send({ result });
    } catch (error) {
      logger.error('Error while creating session', error);
      res.status(400).send({ message: 'Error while creating session' });
    }
  });

  return api;
}