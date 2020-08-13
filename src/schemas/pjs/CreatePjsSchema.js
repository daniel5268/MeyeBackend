module.exports = {
  title: 'CreatePjSchema',
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
    race: { type: 'string', minLength: 2 },
    type: { type: 'string', enum: ['human', 'soko', 'beast'] },
    basic_talent: { type: 'string', enum: ['physical', 'mental', 'coordination', 'energy'] },
    special_talent: { type: 'string', enum: ['bodily_abilities', 'energy_abilities', 'mental_abilities'] },
    description: { type: 'string' },
  },
  required: ['name', 'type'],
  additionalProperties: false,
};
