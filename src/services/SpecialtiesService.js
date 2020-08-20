const SpecialtiesService = module.exports;

const SpecialtiesRepository = require('../repositories/SpecialtiesRepository');
const { GetFormattedError } = require('../utils/ErrorUtils');

SpecialtiesService.create = async (specialtyInfo, options) => {
  const section = 'SpecialtiesService.create';
  const { logger = console } = options;
  logger.info(section, `starts with ${JSON.stringify(specialtyInfo)}`);

  const { name } = specialtyInfo;

  const existingSpecialty = await SpecialtiesRepository.findOne({ name });

  if (existingSpecialty) throw new GetFormattedError(`Specialty with name: ${name} already exists`, 400, 400);

  return SpecialtiesRepository.insertOne(specialtyInfo);
};

SpecialtiesService.getAll = async (query, options = {}) => {
  const section = 'SpecialtiesService.getAll';
  const { logger = console } = options;
  logger.info(section, `starts with ${JSON.stringify({ query })}`);

  const { page = 1, size = 20, ...filters } = query;

  const specialties = await SpecialtiesRepository.list(+page, +size, filters);

  const [{ count: countValue }] = await SpecialtiesRepository.count(filters);

  return {
    data: specialties,
    page,
    size,
    last_page: Math.ceil(countValue / size),
    total: +countValue,
  };
};

SpecialtiesService.update = async (specialtyId, specialtyInfo, options = {}) => {
  const section = 'SpecialtiesService.update';
  const { logger = console } = options;

  logger.info(section, `starts for user with id ${specialtyId} with ${JSON.stringify(specialtyInfo)}`);

  const specialty = await SpecialtiesRepository.findOne({ id: specialtyId });

  if (!specialty) throw new GetFormattedError(`Specialty with id: ${specialtyId} not found`, 404, 404);

  const { name } = specialtyInfo;

  const existingName = await SpecialtiesRepository.findByNameWithDistinctId(name, specialtyId);

  if (existingName) throw new GetFormattedError(`Name ${name} already taken`, 400, 400);

  return SpecialtiesRepository.updateOne(specialtyInfo, { id: specialtyId });
};

SpecialtiesService.delete = async (specialtyId, options = {}) => {
  const section = 'SpecialtiesService.delete';
  const { logger = console } = options;
  logger.info(section, `starts for specialty with id ${specialtyId}`);

  const specialty = await SpecialtiesRepository.findOne({ id: specialtyId });

  if (!specialty) throw new GetFormattedError(`Specialty with id: ${specialtyId} not found`, 404, 404);

  return SpecialtiesRepository.delete({ id: specialtyId });
};
