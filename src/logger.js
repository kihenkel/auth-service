let logLevel = require('config').get('logLevel') || 'info';
const LOG_LEVELS = ['verbose', 'info', 'warn', 'error'];
logLevel = LOG_LEVELS.includes(logLevel) ? logLevel : LOG_LEVELS[1];
console.log(`Log level is ${logLevel}`);
const shouldLogVerbose = logLevel === 'verbose';
const shouldLogInfo = logLevel === 'verbose' || logLevel === 'info';
const shouldLogWarn = logLevel === 'verbose' || logLevel === 'info' || logLevel === 'warn';

const Color = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  white: '\x1b[37m',
};

const logVerbose = (...args) => {
  if (shouldLogVerbose) {
    console.log('[Verbose]', ...args);
  }
};

const logInfo = (...args) => {
  if (shouldLogInfo) {
    console.log(...args);
  }
};

const logWarn = (...args) => {
  if (shouldLogWarn) {
    console.warn(`[${Color.yellow}Warning${Color.white}]`, ...args);
  }
};

const logError = (...args) => {
  console.error(`[${Color.red}ERROR${Color.white}]`, ...args);
};

const requestLoggerMiddleware = () => (request, response, next) => {
  logVerbose(`${request.method} ${request.originalUrl}`);
  next();
};

module.exports = {
  verbose: logVerbose,
  info: logInfo,
  warn: logWarn,
  error: logError,
  requestLoggerMiddleware,
};