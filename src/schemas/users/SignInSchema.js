module.exports = {
  title: 'SignInSchema',
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 1, maxLength: 30 },
    secret: { type: 'string' },
  },
  required: ['username', 'secret'],
  additionalProperties: false,
};
