const XpAssignationsService = module.exports;

const { GetFormattedError } = require('../utils/ErrorUtils');
const { PJS } = require('../repositories/TableNames');
const { [PJS]: PjsRepository } = require('../repositories/GenericRepository');
const XpAssignationsRepository = require('../repositories/XpAssignationsRepository');

XpAssignationsService.create = async (pjId, assignationInfo, options) => {
  const section = 'XpAssignationsService.create';
  const { logger = console } = options;
  logger.info(section, `starts for pj with id: ${pjId} with ${JSON.stringify(assignationInfo)}`);

  const pj = await PjsRepository.findOne({ id: pjId });

  if (!pj) throw new GetFormattedError(`Pj with id: ${pjId} not found`, 404, 404);

  return XpAssignationsRepository.insertOne({ ...assignationInfo, pj_id: pjId });
};

XpAssignationsService.getAll = async (params, options = {}) => {
  const section = 'XpAssignationsService.getAll';
  const { logger = console } = options;
  logger.info(section, `starts with ${JSON.stringify({ params })}`);

  const { page = 1, size = 20, ...filters } = params;
  const { pj_id: pjId } = filters;

  const pj = await PjsRepository.findOne({ id: pjId });

  if (!pj) throw new GetFormattedError(`Pj with id: ${pjId} not found`, 404, 404);

  const xpAssignations = await XpAssignationsRepository.list(+page, +size, filters);

  const [{ count: countValue }] = await XpAssignationsRepository.count(filters);

  return {
    data: xpAssignations,
    page,
    size,
    last_page: Math.ceil(countValue / size),
    total: +countValue,
  };
};
