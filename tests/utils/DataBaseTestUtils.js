const DataBaseTestUtils = module.exports;

const knex = require('knex');

const EncryptionService = require('../../src/services/EncryptionService');
const { dataBaseConfig } = require('../../src/config');
const {
  USERS, PJS, XP_ASSIGNATIONS, SPECIALTIES, SPECIALTY_OWNERSHIPS,
} = require('../../src/repositories/TableNames');
const UsersTestData = require('../data/UsersTestData');
const PjsTestData = require('../data/PjsTestData');

const db = knex(dataBaseConfig);

DataBaseTestUtils.cleanDataBase = async () => {
  await db(XP_ASSIGNATIONS).delete();
  await db(PJS).delete();
  await db(USERS).delete();
  await db(SPECIALTY_OWNERSHIPS).delete();
  await db(SPECIALTIES).delete();

  await Promise.all([
    DataBaseTestUtils.resetId(XP_ASSIGNATIONS),
    DataBaseTestUtils.resetId(PJS),
    DataBaseTestUtils.resetId(USERS),
    DataBaseTestUtils.resetId(SPECIALTY_OWNERSHIPS),
    DataBaseTestUtils.resetId(SPECIALTIES),
  ]);
};

DataBaseTestUtils.insertInitialTestData = async () => {
  const userToInsert = { ...UsersTestData.user, secret: await EncryptionService.hash(UsersTestData.user.secret) };

  const { id: userId } = await db(USERS).insert(userToInsert).returning('*').then(([inserted]) => inserted);
  const { id: pjId } = await db(PJS).insert({ ...PjsTestData.pj, user_id: userId })
    .returning('*').then(([inserted]) => inserted);

  return { user_id: userId, pj_id: pjId };
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
