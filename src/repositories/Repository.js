const { GetFormattedError } = require('../utils/ErrorUtils');

const Repository = {};

module.exports = function createRepository(db, tableNames) {
  if (!db || !tableNames) {
    throw new GetFormattedError('db and tableNames should be provided', 500, 500);
  }

  if (Object.entries(Repository).length) return Repository;

  Repository.find = (table, query = {}) => db(table).where(query);

  Repository.findOne = (table, query = {}) => db(table).where(query).first();

  Repository.insert = (table, data) => db(table).insert(data).returning('*');

  Repository.insertOne = (table, data) => db(table).insert(data).returning('*').then(([inserted]) => inserted);

  Repository.update = (table, data, query = {}) => db(table).update(data).where(query).returning('*');

  Repository.updateOne = (table, data, query = {}) => db(table).update(data).where(query).returning('*')
    .then(([updated]) => updated);

  Repository.delete = (table, query) => db(table).where(query).delete();

  Object.keys(tableNames).forEach((tableKey) => {
    const tableName = tableNames[tableKey];
    Repository[tableName] = {
      find: (query) => Repository.find(tableName, query),
      findOne: (query) => Repository.findOne(tableName, query),
      insert: (data) => Repository.insert(tableName, data),
      insertOne: (data) => Repository.insertOne(tableName, data),
      update: (data, query) => Repository.update(tableName, data, query),
      updateOne: (data, query) => Repository.updateOne(tableName, data, query),
      delete: (query) => Repository.delete(tableName, query),
    };
  });

  return Repository;
};
