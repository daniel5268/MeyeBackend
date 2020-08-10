const knex = require('knex');

const { dataBaseConfig } = require('../config');
const { USERS } = require('./TableNames');
const { [USERS]: BasicUsersRepository } = require('./GenericRepository');

const db = knex(dataBaseConfig);

const UsersRepository = { ...BasicUsersRepository };

UsersRepository.findByUsernameWithDistinctId = (username, id) => db(USERS)
  .where({ username })
  .andWhereNot({ id })
  .first();

UsersRepository.list = (page = 1, size = 20, filters) => {
  const offset = (page - 1) * size;

  return db(USERS)
    .where(filters)
    .offset(offset)
    .limit(size)
    .orderBy('id', 'asc');
};

UsersRepository.count = (filters) => db(USERS).where(filters).count();

module.exports = UsersRepository;
