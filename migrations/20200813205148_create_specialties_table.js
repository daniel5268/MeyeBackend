const { SPECIALTIES } = require('../src/repositories/TableNames');
const DataBaseUpdateTrigger = require('../src/utils/DataBaseUpdateTrigger');

exports.up = (knex) => knex.schema.createTable(SPECIALTIES, (table) => {
  table.increments('id');
  table.json('data').notNullable();
  table.string('description').notNullable();
  table.timestamps(true, true);
}).then(() => knex.raw(DataBaseUpdateTrigger(SPECIALTIES)));

exports.down = (knex) => knex.schema.dropTable(SPECIALTIES);
