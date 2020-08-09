const { USERS } = require('../src/repositories/TableNames');

exports.up = (knex) => knex.schema.table(USERS, async (table) => {
  await table.string('is_pnj').defaultTo(false);
});

exports.down = (knex) => knex.schema.table(USERS, async (table) => {
  await table.dropColumn('is_pnj');
});
