module.exports = {
  title: 'UpdateUserSchema',
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 1, maxLength: 30 },
    secret: { type: 'string', minLength: 6, maxLength: 30 },
    is_admin: { type: 'boolean' },
    is_master: { type: 'boolean' },
    is_player: { type: 'boolean' },
    is_pnj: { type: 'boolean' },
  },
  additionalProperties: false,
};
