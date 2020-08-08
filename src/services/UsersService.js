const UsersService = module.exports;

const EncryptionService = require('./EncryptionService');
const JwtService = require('./JwtService');
const { USERS } = require('../repositories/TableNames');
const { [USERS]: UsersRepository } = require('../repositories/GenericRepository');
const { GetFormattedError } = require('../utils/ErrorUtils');

UsersService.signIn = async (signInInfo, options = {}) => {
  const section = 'UsersService.signIn';
  const { logger = console } = options;
  logger.debug(section, 'starts');

  const { username, secret: providedSecret } = signInInfo;
  const user = await UsersRepository.findOne({ username });

  if (!user) throw new GetFormattedError(`User with username: ${username} not found`, 404, 404);

  const { secret: hashedSecret } = user;
  const isSecretValid = await EncryptionService.compare(providedSecret, hashedSecret);

  if (!isSecretValid) throw new GetFormattedError('Unauthorized', 401, 401);

  return { token: JwtService.sign({ username }, options) };
};
