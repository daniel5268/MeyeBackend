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

  const { id: userId } = await db(USERS).insert(userToInsert).returning('*').then(([inserted]) => inserted);

  return { user_id: userId };
};

DataBaseTestUtils.cleanRecord = (record, removeId = true) => {
  const { created_at: createdAt, updated_at: updatedAt, ...cleanedRecord } = record;

  if (removeId) {
    delete cleanedRecord.id;
  }

  return cleanedRecord;
};

DataBaseTestUtils.cleanRecords = (records, removeId = true) => records
  .map((record) => DataBaseTestUtils.cleanRecord(record, removeId));
