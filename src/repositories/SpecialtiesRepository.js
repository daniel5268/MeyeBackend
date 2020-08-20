const knex = require('knex');

const { dataBaseConfig } = require('../config');
const { SPECIALTIES } = require('./TableNames');
const { [SPECIALTIES]: BasicSpecialtiesRepository } = require('./GenericRepository');

const db = knex(dataBaseConfig);

const SpecialtiesRepository = { ...BasicSpecialtiesRepository };

SpecialtiesRepository.list = (page = 1, size = 20, filters) => {
  const offset = (page - 1) * size;

  return db(SPECIALTIES)
    .where(filters)
    .offset(offset)
    .limit(size)
    .orderBy('id', 'asc');
};

SpecialtiesRepository.count = (filters) => db(SPECIALTIES).where(filters).count();

SpecialtiesRepository.findByNameWithDistinctId = (name, id) => db(SPECIALTIES)
  .where({ name })
  .andWhereNot({ id })
  .first();

module.exports = SpecialtiesRepository;
