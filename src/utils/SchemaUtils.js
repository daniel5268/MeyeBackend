const Ajv = require('ajv');

const { GetFormattedError } = require('./ErrorUtils');

const SchemaUtils = module.exports;

SchemaUtils.validateSchema = (schema, data, options = {}) => {
  const section = 'Schemas.validateSchema';
  const { logger = console } = options;
  logger.debug(section, `Starts with ${JSON.stringify({ schema, data })}`);
  const ajv = new Ajv();
  const compiler = ajv.compile(schema);

  const isValid = compiler(data);

  if (!isValid) {
    const validationError = compiler.errors[0];
    const { message, dataPath = '' } = validationError;
    const errorMessage = `${dataPath.replace('.', '')} ${message.replace('.', '')}`;

    throw new GetFormattedError(errorMessage, 400, 400);
  }

  return isValid;
};
