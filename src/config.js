const { DB_CONNECTION, MAX_CONNECTION_POOLSIZE } = process.env;

module.exports = {
  dataBaseConfig: {
    client: 'pg',
    connection: DB_CONNECTION,
    pool: { min: 1, max: MAX_CONNECTION_POOLSIZE },
    acquireConnectionTimeout: 5000,
    connectionTimeout: 10000,
  },
};
