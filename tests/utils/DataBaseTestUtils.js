const DataBaseTestUtils = module.exports;

const knex = require('knex');

const EncryptionService = require('../../src/services/EncryptionService');
const { dataBaseConfig } = require('../../src/config');
const { USERS, PJS } = require('../../src/repositories/TableNames');
const UsersTestData = require('../data/UsersTestData');

const db = knex(dataBaseConfig);

DataBaseTestUtils.cleanDataBase = async () => {
  await db(PJS).delete();
  await db(USERS).delete();

  await DataBaseTestUtils.resetId(USERS);
  await DataBaseTestUtils.resetId(PJS);
};

DataBaseTestUtils.insertInitialTestData = async () => {
  const userToInsert = { ...UsersTestData.user, secret: await EncryptionService.hash(UsersTestData.user.secret) };

  const { id: userId } = await db(USERS).insert(userToInsert).returning('*').then(([inserted]) => inserted);

  return { user_id: userId };
};

DataBaseTestUtils.resetId = (tableName) => db.schema.raw(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 1`);

DataBaseTestUtils.cleanRecord = (record, removeId = true) => {
  const { created_at: createdAt, updated_at: updatedAt, ...cleanedRecord } = record;

  if (removeId) {
    delete cleanedRecord.id;
  }

  return cleanedRecord;
};

DataBaseTestUtils.cleanRecords = (records, removeId = true) => records
  .map((record) => DataBaseTestUtils.cleanRecord(record, removeId));
