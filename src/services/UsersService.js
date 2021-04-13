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
  logger.info(section, 'starts');

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
  const { secret, ...cleanedUserInfo } = userInfo;

  logger.info(section, `starts with ${JSON.stringify(cleanedUserInfo)}`);

  const { username } = userInfo;
  const user = await UsersRepository.findOne({ username });

  if (user) throw new GetFormattedError(`User with username: ${username} already exists`, 400, 400);

  const hashedSecret = await EncryptionService.hash(secret);

  return UsersRepository.insertOne({ ...userInfo, secret: hashedSecret });
};

UsersService.getAll = async (query, options = {}) => {
  const section = 'UsersService.getAll';
  const { logger = console } = options;
  logger.info(section, `starts with ${JSON.stringify({ query })}`);

  const { page = 1, size = 20, ...filters } = query;

  const users = await UsersRepository.list(+page, +size, filters);
  const pageContent = users.map(({ secret, ...cleanedUser }) => cleanedUser);

  const [{ count: countValue }] = await UsersRepository.count(filters);

  return {
    data: pageContent,
    page,
    size,
    last_page: Math.ceil(countValue / size),
    total: +countValue,
  };
};

UsersService.update = async (userId, userInfo, options = {}) => {
  const section = 'UsersService.update';
  const { logger = console } = options;
  const { secret: providedSecret, ...cleanedUserInfo } = userInfo;

  logger.info(section, `starts for user with id ${userId} with ${JSON.stringify(cleanedUserInfo)}`);

  const user = await UsersRepository.findOne({ id: userId });

  if (!user) throw new GetFormattedError(`User with id: ${userId} not found`, 404, 404);

  const { username } = userInfo;

  const isUsernameTaken = !!await UsersRepository.findByUsernameWithDistinctId(username, userId);

  if (isUsernameTaken) throw new GetFormattedError(`Username ${username} already taken`, 400, 400);

  const { secret: previousHashedSecret } = user;

  const hashedSecret = providedSecret ? await EncryptionService.hash(providedSecret) : previousHashedSecret;

  return UsersRepository.updateOne({ ...userInfo, secret: hashedSecret }, { id: userId });
};

UsersService.delete = async (userId, options = {}) => {
  const section = 'UsersService.delete';
  const { logger = console } = options;
  logger.info(section, `starts for user with id ${userId}`);

  const user = await UsersRepository.findOne({ id: userId });

  if (!user) throw new GetFormattedError(`User with id: ${userId} not found`, 404, 404);

  return UsersRepository.delete({ id: userId });
};
