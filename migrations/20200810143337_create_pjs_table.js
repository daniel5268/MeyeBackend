const { PJS, USERS } = require('../src/repositories/TableNames');
const DataBaseUpdateTrigger = require('../src/utils/DataBaseUpdateTrigger');

exports.up = (knex) => knex.schema.createTable(PJS, (table) => {
  table.increments('id');
  table.integer('user_id').notNullable().references('id').inTable(USERS)
    .onDelete('CASCADE');

  table.string('name').notNullable();
  table.string('type').notNullable();
  table.string('race');
  table.text('description');

  table.integer('sanity').defaultTo(0);
  table.integer('charisma').defaultTo(0);
  table.integer('villainy').defaultTo(0);
  table.integer('heroism').defaultTo(0);
  table.integer('appearance').defaultTo(0);
  table.integer('age').defaultTo(0);
  table.integer('height').defaultTo(0);
  table.integer('weight').defaultTo(0);

  table.string('basic_talent');
  table.string('special_talent');

  table.json('stats').defaultTo({
    basic: {
      physical: {
        strength: 0, agility: 0, speed: 0, resistance: 0,
      },
      mental: {
        intelligence: 0, wisdom: 0, concentration: 0, will: 0,
      },
      coordination: {
        precision: 0, calculation: 0, range: 0, reflexes: 0,
      },
    },

    abilities: {
      bodily: { empowerment: 0, vital_control: 0 },
      energy: { pure_energy: 0, objects_control: 0 },
      mental: { delusion: 0, mental_control: 0 },
    },

    energy: { basic: 0, special: 0 },
    life: 0,

    divine: { },
  });

  table.integer('renels').defaultTo(0);
  table.integer('bag_size').defaultTo(0);

  table.boolean('commerce').defaultTo(false);
  table.boolean('storage').defaultTo(false);

  table.timestamps(true, true);
}).then(() => knex.raw(DataBaseUpdateTrigger(PJS)));

exports.down = (knex) => knex.schema.dropTable(PJS);
