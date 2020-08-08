require('dotenv').config({ path: `${process.env.APP_ENV}.env` });

const assert = require('assert');

const { dataBaseConfig } = require('./src/config');

const { connection } = dataBaseConfig;

assert(connection, 'DB_CONNECTION must be provided');

module.exports = {
  ...dataBaseConfig,
  migration: {
    directory: './migrations',
    tableName: 'migrations',
  },
};
