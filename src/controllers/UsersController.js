const UsersController = module.exports;

const SchemaUtils = require('../utils/SchemaUtils');
const SignInSchema = require('../schemas/users/SignInSchema');
const CreateUserSchema = require('../schemas/users/CreateUserSchema');
const UpdateUserSchema = require('../schemas/users/UpdateUserSchema');
const UsersService = require('../services/UsersService');

UsersController.signIn = (req, res, next) => {
  const section = 'UsersController.signIn';
  const { logger = console, body } = req;
  logger.info(section, `starts for body ${JSON.stringify(body)}`);

  const options = { logger };

  SchemaUtils.validateSchema(SignInSchema, body, options);

  return UsersService.signIn(body, options)
    .then((signInInfo) => res.send(signInInfo))
    .catch((error) => next(error));
};

UsersController.create = (req, res, next) => {
  const section = 'UsersController.create';
  const { logger = console, body: { secret, ...cleanedBody } = {}, body } = req;
  logger.info(section, `starts with ${JSON.stringify(cleanedBody)}`);

  const options = { logger };

  SchemaUtils.validateSchema(CreateUserSchema, body, options);

  return UsersService.create(body, options)
    .then((createdUser) => res.status(201).send(createdUser))
    .catch((error) => next(error));
};

UsersController.update = (req, res, next) => {
  const section = 'UsersController.update';
  const {
    logger = console, body: { secret, ...cleanedBody } = {}, body, params: { userId },
  } = req;
  logger.info(section, `starts with ${JSON.stringify(cleanedBody)}`);

  const options = { logger };

  SchemaUtils.validateSchema(UpdateUserSchema, body, options);

  return UsersService.update(userId, body, options)
    .then((updatedUser) => res.send(updatedUser))
    .catch((error) => next(error));
};
