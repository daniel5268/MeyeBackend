const { SPECIALTY_OWNERSHIPS, PJS, SPECIALTIES } = require('../src/repositories/TableNames');
const DataBaseUpdateTrigger = require('../src/utils/DataBaseUpdateTrigger');

exports.up = (knex) => knex.schema.createTable(SPECIALTY_OWNERSHIPS, (table) => {
  table.increments('id');
  table.integer('pj_id').notNullable().references('id').inTable(PJS)
    .onDelete('CASCADE');
  table.integer('specialty_id').notNullable().references('id').inTable(SPECIALTIES)
    .onDelete('CASCADE');
  table.integer('value').notNullable().defaultTo(0);
  table.unique(['pj_id', 'specialty_id']);
  table.timestamps(true, true);
}).then(() => knex.raw(DataBaseUpdateTrigger(SPECIALTY_OWNERSHIPS)));

exports.down = (knex) => knex.schema.dropTable(SPECIALTY_OWNERSHIPS);
