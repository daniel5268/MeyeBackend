const UsersController = module.exports;

const SchemaUtils = require('../utils/SchemaUtils');
const SignInSchema = require('../schemas/users/SignInSchema');
const CreateUserSchema = require('../schemas/users/CreateUserSchema');
const UpdateUserSchema = require('../schemas/users/UpdateUserSchema');
const GetUsersQuerySchema = require('../schemas/users/GetUsersQuerySchema');
const UsersService = require('../services/UsersService');
const ErrorUtils = require('../utils/ErrorUtils');

UsersController.signIn = (req, res, next) => {
  const section = 'UsersController.signIn';
  const { logger = console, body } = req;
  logger.info(section, 'starts');

  const options = { logger };

  SchemaUtils.validateSchema(SignInSchema, body, options);

  return UsersService.signIn(body, options)
    .then((signInInfo) => res.send(signInInfo))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

UsersController.create = (req, res, next) => {
  const section = 'UsersController.create';
  const { logger = console, body: { secret, ...cleanedBody } = {}, body } = req;
  logger.info(section, `starts with ${JSON.stringify(cleanedBody)}`);

  const options = { logger };

  SchemaUtils.validateSchema(CreateUserSchema, body, options);

  return UsersService.create(body, options)
    .then((createdUser) => res.status(201).send(createdUser))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

UsersController.getAll = (req, res, next) => {
  const section = 'UsersController.getAll';
  const { logger = console, query } = req;
  logger.info(section, `starts with ${JSON.stringify({ query })}`);

  const options = { logger };

  SchemaUtils.validateSchema(GetUsersQuerySchema, query, options);

  return UsersService.getAll(query, options)
    .then((pageInfo) => res.send(pageInfo))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

UsersController.update = (req, res, next) => {
  const section = 'UsersController.update';
  const {
    logger = console, body: { secret, ...cleanedBody } = {}, body, params: { userId },
  } = req;
  logger.info(section, `starts with ${JSON.stringify(cleanedBody)}`);

  const options = { logger };

  SchemaUtils.validateSchema(UpdateUserSchema, body, options);

  return UsersService.update(+userId, body, options)
    .then((updatedUser) => res.send(updatedUser))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

UsersController.delete = (req, res, next) => {
  const section = 'UsersController.delete';
  const { logger = console, params: { userId } } = req;
  logger.info(section, `starts for user with id ${userId}`);

  const options = { logger };

  return UsersService.delete(+userId, options)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};
