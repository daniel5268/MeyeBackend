const { xpTypes } = require('../../utils/Constants');

module.exports = {
  title: 'GetPjXpAssignationsQuerySchema',
  type: 'object',
  properties: {
    type: { type: 'string', enum: xpTypes },
    page: { type: 'string', pattern: '\\d+' },
    size: { type: 'string', pattern: '\\d+' },
  },
  additionalProperties: false,
};
