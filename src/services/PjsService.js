const PjsService = module.exports;

const UsersRepository = require('../repositories/UsersRepository');
const { PJS, XP_ASSIGNATIONS } = require('../repositories/TableNames');
const {
  [PJS]: PjsRepository,
  [XP_ASSIGNATIONS]: XpAssignationsRepository,
} = require('../repositories/GenericRepository');
const PjUtils = require('../utils/PjUtils');
const { GetFormattedError } = require('../utils/ErrorUtils');

PjsService.create = async (userId, pjInfo, options = {}) => {
  const section = 'PjsService.create';
  const { logger = console } = options;
  logger.info(section, `starts for ${userId} with ${JSON.stringify(pjInfo)}`);

  const user = await UsersRepository.findOne({ id: userId });

  if (!user) throw new GetFormattedError(`User with id: ${userId} not found`, 404, 404);

  return PjsRepository.insertOne({ ...pjInfo, user_id: userId });
};

PjsService.update = async (userId, pjId, pjInfo, options = {}) => {
  const section = 'PjsService.update';
  const { logger = console } = options;
  logger.info(section, `starts for ${JSON.stringify(userId, pjId)} with ${JSON.stringify(pjInfo)}`);

  const user = await UsersRepository.findOne({ id: userId });

  if (!user) throw new GetFormattedError(`User with id: ${userId} not found`, 404, 404);

  const pj = await PjsRepository.findOne({ id: pjId });

  if (!pj) throw new GetFormattedError(`Pj with id: ${pjId} not found`, 404, 404);

  const updatedPjInfo = { ...pj, ...pjInfo };

  if (Object.keys(pjInfo).includes('stats')) {
    const pjXpAssignations = await XpAssignationsRepository.find({ pj_id: pjId });
    const earnedXp = pjXpAssignations.reduce((accumulatedXp, currentXpAssignation) => {
      const newAccumulatedXp = { ...accumulatedXp };
      const { type, amount } = currentXpAssignation;

      newAccumulatedXp[type] += amount;

      return newAccumulatedXp;
    }, { basic: 0, special: 0, divine: 0 });

    const pjState = PjUtils.getPjValidStates(updatedPjInfo, earnedXp, options);
    const { xp_valid: xpValid } = pjState;

    if (!xpValid) throw new GetFormattedError(JSON.stringify(pjState), 400, 400);
  }

  return PjsRepository.updateOne(updatedPjInfo, { id: pjId });
};

PjsService.getByUser = async (userId, options) => {
  const section = 'PjsService.getByUser';
  const { logger = console } = options;
  logger.info(section, `starts for user with id ${userId}`);

  const user = await UsersRepository.findOne({ id: userId });

  if (!user) throw new GetFormattedError(`User with id: ${userId} not found`, 404, 404);

  return PjsRepository.find({ user_id: userId });
};

PjsService.delete = async (userId, pjId, options = {}) => {
  const section = 'PjsService.delete';
  const { logger = console } = options;
  logger.info(section, `starts for ${JSON.stringify(userId, pjId)}`);

  const user = await UsersRepository.findOne({ id: userId });

  if (!user) throw new GetFormattedError(`User with id: ${userId} not found`, 404, 404);

  const pj = await PjsRepository.findOne({ id: pjId });

  if (!pj) throw new GetFormattedError(`Pj with id: ${pjId} not found`, 404, 404);

  if (pj.user_id !== userId) throw new GetFormattedError('Forbidden', 403, 403);

  return PjsRepository.delete({ id: pjId });
};
