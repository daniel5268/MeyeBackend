const { USERS } = require('../src/repositories/TableNames');
const DataBaseUpdateTrigger = require('../src/utils/DataBaseUpdateTrigger');

exports.up = (knex) => knex.schema.createTable(USERS, (table) => {
  table.increments('id');
  table.string('username').notNullable().unique();
  table.string('secret').notNullable();
  table.boolean('is_admin').notNullable().defaultTo(false);
  table.boolean('is_master').notNullable().defaultTo(false);
  table.boolean('is_player').notNullable().defaultTo(false);
  table.timestamps(true, true);
}).then(() => knex.raw(DataBaseUpdateTrigger(USERS)));

exports.down = (knex) => knex.schema.dropTable(USERS);
