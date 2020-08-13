module.exports = {
  title: 'UpdatePjSchema',
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
    race: { type: 'string', minLength: 2 },
    type: { type: 'string', enum: ['human', 'soko', 'beast'] },
    description: { type: 'string' },
    sanity: { type: 'integer', minimum: 0 },
    charisma: { type: 'integer', minimum: -10, maximum: 10 },
    villainy: { type: 'integer', minimum: 0, maximum: 10 },
    heroism: { type: 'integer', minimum: 0, maximum: 10 },
    appearance: { type: 'integer', minimum: 0, maximum: 20 },
    age: { type: 'integer', minimum: 0 },
    height: { type: 'integer', minimum: 0 },
    weight: { type: 'integer' },
    basic_talent: { type: 'string', enum: ['physical', 'mental', 'coordination', 'energy'] },
    special_talent: { type: 'string', enum: ['bodily', 'energy', 'mental'] },
    stats: {
      type: 'object',
      properties: {
        basic: {
          type: 'object',
          properties: {
            physical: {
              type: 'object',
              properties: {
                strength: { type: 'integer', minimum: 0 },
                agility: { type: 'integer', minimum: 0 },
                speed: { type: 'integer', minimum: 0 },
                resistance: { type: 'integer', minimum: 0 },
              },
              additionalProperties: false,
            },
            mental: {
              type: 'object',
              properties: {
                intelligence: { type: 'integer', minimum: 0 },
                wisdom: { type: 'integer', minimum: 0 },
                concentration: { type: 'integer', minimum: 0 },
                will: { type: 'integer', minimum: 0 },
              },
              additionalProperties: false,
            },
            coordination: {
              type: 'object',
              properties: {
                precision: { type: 'integer', minimum: 0 },
                calculation: { type: 'integer', minimum: 0 },
                range: { type: 'integer', minimum: 0 },
                reflexes: { type: 'integer', minimum: 0 },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        abilities: {
          type: 'object',
          properties: {
            bodily: {
              type: 'object',
              properties: {
                empowerment: { type: 'integer', minimum: 0 }, vital_control: { type: 'integer', minimum: 0 },
              },
              additionalProperties: false,
            },
            energy: {
              type: 'object',
              properties: {
                pure_energy: { type: 'integer', minimum: 0 }, objects_control: { type: 'integer', minimum: 0 },
              },
              additionalProperties: false,
            },
            mental: {
              type: 'object',
              properties: {
                delusion: { type: 'integer', minimum: 0 }, mental_control: { type: 'integer', minimum: 0 },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        energy: {
          type: 'object',
          properties: {
            basic: { type: 'integer', minimum: 0 },
            special: { type: 'integer', minimum: 0 },
          },
          additionalProperties: false,
        },
        life: { type: 'integer', minimum: 0 },
        divine: { type: 'object', properties: {}, additionalProperties: false },
      },
      additionalProperties: false,
    },
    renels: { type: 'integer', minimum: 0 },
    bag_size: { type: 'integer', minimum: 0 },
    commerce: { type: 'boolean' },
    storage: { type: 'boolean' },
  },
  additionalProperties: false,
};
