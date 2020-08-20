const { SPECIALTIES } = require('../src/repositories/TableNames');
const DataBaseUpdateTrigger = require('../src/utils/DataBaseUpdateTrigger');

exports.up = (knex) => knex.schema.createTable(SPECIALTIES, (table) => {
  table.increments('id');
  table.string('name').notNullable().unique();
  table.string('associated_stat').notNullable();
  table.string('description');
  table.timestamps(true, true);
}).then(() => knex.raw(DataBaseUpdateTrigger(SPECIALTIES)));

exports.down = (knex) => knex.schema.dropTable(SPECIALTIES);
