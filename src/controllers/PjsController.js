const PjsController = module.exports;

const SchemaUtils = require('../utils/SchemaUtils');
const CreatePjsSchema = require('../schemas/pjs/CreatePjsSchema');
const UpdatePjsSchema = require('../schemas/pjs/UpdatePjsSchema');
const XpAssignationSchema = require('../schemas/pjs/XpAssignationSchema');
const GetPjXpAssignationsQuerySchema = require('../schemas/pjs/GetPjXpAssignationsQuerySchema');
const ErrorUtils = require('../utils/ErrorUtils');
const PjsService = require('../services/PjsService');
const XpAssignationsService = require('../services/XpAssignationsService');

PjsController.create = (req, res, next) => {
  const section = 'PjsController.create';
  const { logger = console, body, params: { userId } } = req;
  logger.info(section, `starts with ${JSON.stringify(body)}`);

  const options = { logger };

  SchemaUtils.validateSchema(CreatePjsSchema, body, options);

  return PjsService.create(+userId, body, options)
    .then((createdUser) => res.status(201).send(createdUser))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

PjsController.update = (req, res, next) => {
  const section = 'PjsController.update';
  const { logger = console, body, params: { userId, pjId } } = req;
  logger.info(section, `starts for ${JSON.stringify({ userId, pjId })} with ${JSON.stringify(body)}`);

  const options = { logger };

  SchemaUtils.validateSchema(UpdatePjsSchema, body, options);

  return PjsService.update(+userId, +pjId, body, options)
    .then((updatedUser) => res.send(updatedUser))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

PjsController.getByUser = (req, res, next) => {
  const section = 'PjsController.getByUser';
  const { logger = console, params: { userId } } = req;
  logger.info(section, `starts for ${userId}`);

  const options = { logger };

  return PjsService.getByUser(+userId, options)
    .then((userPjs) => res.send(userPjs))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

PjsController.delete = (req, res, next) => {
  const section = 'PjsController.delete';
  const { logger = console, params: { userId, pjId } } = req;
  logger.info(section, `starts for ${JSON.stringify({ userId, pjId })}`);

  const options = { logger };

  return PjsService.delete(+userId, +pjId, options)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

PjsController.assignXp = (req, res, next) => {
  const section = 'PjsController.assignXp';
  const {
    logger = console, body, params: { pjId }, headers: { id: userId },
  } = req;
  logger.info(section, `started by user: ${userId} for ${JSON.stringify({ pjId })} with ${JSON.stringify(body)}`);

  const options = { logger };

  SchemaUtils.validateSchema(XpAssignationSchema, body, options);

  return XpAssignationsService.create(+pjId, { ...body, user_id: userId }, options)
    .then((xpAssignation) => res.status(201).send(xpAssignation))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};

PjsController.getXpAssignations = (req, res, next) => {
  const section = 'PjsController.getXpAssignations';
  const { logger = console, query, params: { pjId } } = req;
  logger.info(section, `starts with ${JSON.stringify({ query })}`);

  const options = { logger };

  SchemaUtils.validateSchema(GetPjXpAssignationsQuerySchema, query, options);

  return XpAssignationsService.getAll({ ...query, pj_id: pjId }, options)
    .then((pageInfo) => res.send(pageInfo))
    .catch((error) => {
      logger.error(section, `ends with error: ${ErrorUtils.getErrorLog(error)}`);

      return next(error);
    });
};
