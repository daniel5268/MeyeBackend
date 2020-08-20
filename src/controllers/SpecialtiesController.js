const SpecialtiesController = module.exports;

const SchemaUtils = require('../utils/SchemaUtils');
const CreateSpecialtySchema = require('../schemas/specialties/CreateSpecialtySchema');
const GetSpecialtiesQuerySchema = require('../schemas/specialties/GetSpecialtiesQuerySchema');
const UpdateSpecialtySchema = require('../schemas/specialties/UpdateSpecialtySchema');
const SpecialtiesService = require('../services/SpecialtiesService');
const ErrorUtils = require('../utils/ErrorUtils');

SpecialtiesController.create = (req, res, next) => {
  const section = 'SpecialtiesController.create';
  const { logger = console, body } = req;
  logger.info(section, `starts with body ${JSON.stringify(body)}`);

  const options = { logger };

  SchemaUtils.validateSchema(CreateSpecialtySchema, body, options);

  return SpecialtiesService.create(body, options)
    .then((createdUser) => res.status(201).send(createdUser))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

SpecialtiesController.getAll = (req, res, next) => {
  const section = 'SpecialtiesController.getAll';
  const { logger = console, query } = req;
  logger.info(section, `starts with ${JSON.stringify({ query })}`);

  const options = { logger };

  SchemaUtils.validateSchema(GetSpecialtiesQuerySchema, query, options);

  return SpecialtiesService.getAll(query, options)
    .then((pageInfo) => res.send(pageInfo))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

SpecialtiesController.update = (req, res, next) => {
  const section = 'SpecialtiesController.update';
  const { logger = console, params: { specialtyId }, body } = req;
  logger.info(section, `starts for specialty with id ${specialtyId} with ${JSON.stringify(body)}`);

  const options = { logger };

  SchemaUtils.validateSchema(UpdateSpecialtySchema, body, options);

  return SpecialtiesService.update(+specialtyId, body, options)
    .then((updatedSpecialty) => res.send(updatedSpecialty))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

SpecialtiesController.delete = (req, res, next) => {
  const section = 'SpecialtiesController.delete';
  const { logger = console, params: { specialtyId } } = req;
  logger.info(section, `starts for specialty with id ${specialtyId}`);

  const options = { logger };

  return SpecialtiesService.delete(+specialtyId, options)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};
