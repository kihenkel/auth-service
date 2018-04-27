const mongoose = require('mongoose');
const logger = require('./../logger');
const dbConfig = require('config').get('db');

const connect = async () => {
  logger.info('Connecting database ...');
  try {
    await mongoose.connect(dbConfig.url, {
      autoIndex: true,
      autoReconnect: true,
      auth: dbConfig.user && dbConfig.password && {
        user: dbConfig.user,
        password: dbConfig.password,
      },
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 10,
    });
    logger.info('Database connected!');
  } catch (error) {
    logger.error(`Failed to connect to database: ${error}`);
    throw error;
  }
};

const disconnect = () => {
  logger.info('Disconnecting database ...');
  mongoose.disconnect();
};

module.exports = {
  connect,
  disconnect,
};