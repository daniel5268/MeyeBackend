const { USERS } = require('../src/repositories/TableNames');

const EncryptionService = require('../src/services/EncryptionService');

const initialAdmin = {
  username: 'admin',
  is_admin: true,
};

exports.up = async (knex) => {
  const secret = await EncryptionService.hash('admin');

  return knex(USERS).insert({ ...initialAdmin, secret });
};

exports.down = (knex) => knex(USERS).where(initialAdmin).delete();
