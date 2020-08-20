const { basicProperties } = require('../../utils/Constants');

module.exports = {
  title: 'CreateSpecialtySchema',
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
    description: { type: 'string', minLength: 2 },
    associated_stat: { type: 'string', enum: basicProperties },
  },
  required: ['name', 'associated_stat'],
};
