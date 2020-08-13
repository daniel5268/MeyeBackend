const PjsController = module.exports;

const SchemaUtils = require('../utils/SchemaUtils');
const CreatePjsSchema = require('../schemas/pjs/CreatePjsSchema');
const UpdatePjsSchema = require('../schemas/pjs/UpdatePjsSchema');
const ErrorUtils = require('../utils/ErrorUtils');
const PjsService = require('../services/PjsService');

PjsController.create = (req, res, next) => {
  const section = 'PjsController.create';
  const { logger = console, body, params: { userId } } = req;
  logger.info(section, `starts with ${JSON.stringify(body)}`);

  const options = { logger };

  SchemaUtils.validateSchema(CreatePjsSchema, body, options);

  return PjsService.create(userId, body, options)
    .then((createdUser) => res.status(201).send(createdUser))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

PjsController.update = (req, res, next) => {
  const section = 'PjsController.update';
  const { logger = console, body, params: { userId, pjId } } = req;
  logger.info(section, `starts for ${JSON.stringify({ userId, pjId })} with ${JSON.stringify(body)}`);

  const options = { logger };

  SchemaUtils.validateSchema(UpdatePjsSchema, body, options);

  return PjsService.update(userId, pjId, body, options)
    .then((updatedUser) => res.send(updatedUser))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};
