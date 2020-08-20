const knex = require('knex');

const { dataBaseConfig } = require('../config');
const { XP_ASSIGNATIONS } = require('./TableNames');
const { [XP_ASSIGNATIONS]: BasicXpAssignationsRepository } = require('./GenericRepository');

const db = knex(dataBaseConfig);

const XpAssignationsRepository = { ...BasicXpAssignationsRepository };

XpAssignationsRepository.list = (page = 1, size = 20, filters) => {
  const offset = (page - 1) * size;

  return db(XP_ASSIGNATIONS)
    .where(filters)
    .offset(offset)
    .limit(size)
    .orderBy('id', 'asc');
};

XpAssignationsRepository.count = (filters) => db(XP_ASSIGNATIONS).where(filters).count();

module.exports = XpAssignationsRepository;
