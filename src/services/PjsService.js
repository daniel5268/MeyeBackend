const PjsService = module.exports;

const UsersRepository = require('../repositories/UsersRepository');
const { PJS } = require('../repositories/TableNames');
const { [PJS]: PjsRepository } = require('../repositories/GenericRepository');
const { GetFormattedError } = require('../utils/ErrorUtils');

PjsService.create = async (userId, pjInfo, options = {}) => {
  const section = 'PjsService.create';
  const { logger = console } = options;
  logger.info(section, `starts for ${userId} with ${JSON.stringify(pjInfo)}`);

  const user = await UsersRepository.findOne({ id: userId });

  if (!user) throw new GetFormattedError(`User with id: ${userId} not found`, 404, 404);

  return PjsRepository.insertOne({ ...pjInfo, user_id: userId });
};
