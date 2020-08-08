const knex = require('knex');

const { dataBaseConfig } = require('../config');
const TableNames = require('./TableNames');
const Repository = require('./Repository');

const db = knex(dataBaseConfig);

module.exports = Repository(db, TableNames);
