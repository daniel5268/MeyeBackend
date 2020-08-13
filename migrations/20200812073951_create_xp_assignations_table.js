const { PJS, XP_ASSIGNATIONS, USERS } = require('../src/repositories/TableNames');

exports.up = (knex) => knex.schema.createTable(XP_ASSIGNATIONS, (table) => {
  table.increments('id');
  table.integer('user_id').notNullable().references('id').inTable(USERS)
    .onDelete('CASCADE');
  table.integer('pj_id').notNullable().references('id').inTable(PJS)
    .onDelete('CASCADE');
  table.string('type').notNullable();
  table.integer('amount').notNullable();
  table.timestamp('created_at').defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable(XP_ASSIGNATIONS);
