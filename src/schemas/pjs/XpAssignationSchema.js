const { xpTypes } = require('../../utils/Constants');

module.exports = {
  title: 'XpAssignationSchema',
  type: 'object',
  properties: {
    type: { type: 'string', enum: xpTypes },
    amount: { type: 'integer' },
  },
  required: ['type', 'amount'],
  additionalProperties: false,
};
