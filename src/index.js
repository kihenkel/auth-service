const express = require('express');
const config = require('config');
const logger = require('./logger');
const db = require('./services/dbService');
const api = require('./api');

const app = express();
app.use(logger.requestLoggerMiddleware());

// Register api routes
app.use('/', api());

db.connect()
  .then(() => {
    const port = process.env.npm_package_config_port || 3000;
    const server = app.listen(port);
    logger.info(`Listening on port ${port} ...`);

    process.on('SIGINT', () => {
      logger.warn(`App is about to exit, disconnecting db`);
      db.disconnect();
      server.close();
    });
  })
  .catch(error => {
    logger.error(`Connecting database failed: ${error}`);
    process.exit(1);
  });