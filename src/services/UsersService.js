const UsersService = module.exports;

const EncryptionService = require('./EncryptionService');
const JwtService = require('./JwtService');
const UsersRepository = require('../repositories/UsersRepository');
const { GetFormattedError } = require('../utils/ErrorUtils');

function mapTokenUser(user) {
  const {
    secret, created_at: createdAt, updated_at: updatedAt, ...tokenUser
  } = user;

  return tokenUser;
}

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

  const tokenUser = mapTokenUser(user);

  return { token: JwtService.sign(tokenUser, options) };
};

UsersService.create = async (userInfo, options = {}) => {
  const section = 'UsersService.create';
  const { logger = console } = options;
  logger.debug(section, 'starts');

  const { username, secret } = userInfo;
  const user = await UsersRepository.findOne({ username });

  if (user) throw new GetFormattedError(`User with username: ${username} already exists`, 400, 400);

  const hashedSecret = await EncryptionService.hash(secret);

  return UsersRepository.insertOne({ ...userInfo, secret: hashedSecret });
};

UsersService.update = async (userId, userInfo, options = {}) => {
  const section = 'UsersService.update';
  const { logger = console } = options;
  logger.debug(section, 'starts');

  const user = await UsersRepository.findOne({ id: userId });

  if (!user) throw new GetFormattedError(`User with id: ${userId} not found`, 404, 404);

  const { secret: providedSecret, username } = userInfo;

  const existingUsername = await UsersRepository.findByUsernameWithDistinctId(username, userId);

  if (existingUsername) throw new GetFormattedError(`Username ${username} already taken`, 400, 400);

  const { secret: previousHashedSecret } = user;

  const hashedSecret = providedSecret ? await EncryptionService.hash(providedSecret) : previousHashedSecret;

  return UsersRepository.updateOne({ ...userInfo, secret: hashedSecret }, { id: userId });
};
