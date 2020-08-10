const PjsController = module.exports;

const SchemaUtils = require('../utils/SchemaUtils');
const CreatePjsSchema = require('../schemas/pjs/CreatePjsSchema');
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
