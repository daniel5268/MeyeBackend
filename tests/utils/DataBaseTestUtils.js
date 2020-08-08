const DataBaseTestUtils = module.exports;

const knex = require('knex');

const EncryptionService = require('../../src/services/EncryptionService');
const { dataBaseConfig } = require('../../src/config');
const { USERS } = require('../../src/repositories/TableNames');
const UsersTestData = require('../data/UsersTestData');

const db = knex(dataBaseConfig);

DataBaseTestUtils.cleanDataBase = () => db(USERS).truncate();

DataBaseTestUtils.insertInitialTestData = async () => {
  const userToInsert = { ...UsersTestData.user, secret: await EncryptionService.hash(UsersTestData.user.secret) };

  await db(USERS).insert(userToInsert).returning('*').then(([inserted]) => inserted);
};
