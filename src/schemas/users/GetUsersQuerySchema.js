module.exports = {
  title: 'GetUsersQuerySchema',
  type: 'object',
  properties: {
    is_admin: { type: 'string', enum: ['true', 'false'] },
    is_master: { type: 'string', enum: ['true', 'false'] },
    is_player: { type: 'string', enum: ['true', 'false'] },
    page: { type: 'string', pattern: '[0-9]+' },
    size: { type: 'string', pattern: '[0-9]+' },
  },
  additionalProperties: false,
};
