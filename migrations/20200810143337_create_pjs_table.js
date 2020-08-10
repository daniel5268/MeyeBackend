const { PJS, USERS } = require('../src/repositories/TableNames');
const DataBaseUpdateTrigger = require('../src/utils/DataBaseUpdateTrigger');

exports.up = (knex) => knex.schema.createTable(PJS, (table) => {
  table.increments('id');
  table.integer('user_id').notNullable().references('id').inTable(USERS);
  table.string('name').notNullable();
  table.integer('age').defaultTo(0);
  table.integer('appearance').defaultTo(0);
  table.integer('charisma').defaultTo(0);
  table.integer('heroism').defaultTo(0);
  table.integer('villainy').defaultTo(0);
  table.json('exp').defaultTo({ type_1: 0, type_2: 0, type_3: 0 });
  table.json('containers').defaultTo({ life: 0, energy: 0, special_energy: 0 });
  table.json('type_1').defaultTo({});
  table.json('type_2').defaultTo({});
  table.json('type_3').defaultTo({});

  table.timestamps(true, true);
}).then(() => knex.raw(DataBaseUpdateTrigger(PJS)));

exports.down = (knex) => knex.schema.dropTable(PJS);
