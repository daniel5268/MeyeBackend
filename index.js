require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');

const routes = require('./src/routes');
const ErrorsHandlerMiddleware = require('./src/middlewares/ErrorsHandlerMiddleware');
const LoggerMiddleware = require('./src/middlewares/LoggerMiddleware');

const { PORT, APP_NAME, LOGGER_LEVEL } = process.env;

const server = express();
const logger = log4js.getLogger('console');
logger.level = LOGGER_LEVEL;

server.use(bodyParser.json());
server.use(log4js.connectLogger(logger));
server.use(LoggerMiddleware);
server.use(`/api/${APP_NAME}`, routes);
server.use(ErrorsHandlerMiddleware);

server.listen(PORT, () => {
  logger.info(`Server running in port ${PORT}`);
});

module.exports = server;
