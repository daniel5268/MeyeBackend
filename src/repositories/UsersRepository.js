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

module.exports = UsersRepository;
