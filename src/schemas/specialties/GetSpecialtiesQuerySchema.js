const { basicProperties } = require('../../utils/Constants');

module.exports = {
  title: 'GetSpecialtiesQuerySchema',
  type: 'object',
  properties: {
    associated_stat: { type: 'string', enum: basicProperties },
    page: { type: 'string', pattern: '\\d+' },
    size: { type: 'string', pattern: '\\d+' },
  },
  additionalProperties: false,
};
