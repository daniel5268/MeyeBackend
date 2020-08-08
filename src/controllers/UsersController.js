const UsersController = module.exports;

const SchemaUtils = require('../utils/SchemaUtils');
const SignInSchema = require('../schemas/users/SignInSchema');
const UsersService = require('../services/UsersService');

UsersController.create = (req, res) => {
  const section = 'UsersController.create';
  const { logger = console } = req;
  const { body: { secret, ...cleanedBody } = {} } = req;
  logger.info(section, `starts with ${JSON.stringify(cleanedBody)}`);

  res.send({ message: 'please develop this endpoint' });
};

UsersController.signIn = (req, res, next) => {
  const section = 'UsersController.signIn';
  const { logger = console } = req;
  const { body } = req;
  logger.info(section, `starts for body ${JSON.stringify(body)}`);

  const options = { logger };

  SchemaUtils.validateSchema(SignInSchema, body, options);

  return UsersService.signIn(body, options)
    .then((signInInfo) => res.send(signInInfo))
    .catch((error) => next(error));
};
