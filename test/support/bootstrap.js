/**
 * Support functions for helping with MsSql tests
 */

var _ = require('@sailshq/lodash');
var MSSQL = require('../../helpers/sql');
var adapter = require('../../lib/adapter');


var util = require('util');

var Support = module.exports = {};

Support.Config = {
  host: process.env.MSSQL_HOST || process.env.WATERLINE_ADAPTER_TESTS_HOST || 'localhost',
  user: process.env.MSSQL_USER || process.env.WATERLINE_ADAPTER_TESTS_USER || 'sails',
  password: process.env.MSSQL_PASSWORD || process.env.WATERLINE_ADAPTER_TESTS_PASSWORD || 'sails',
  database: process.env.MSSQL_DB || process.env.WATERLINE_ADAPTER_TESTS_DATABASE || 'sails-test',
  port: process.env.MSSQL_PORT || process.env.WATERLINE_ADAPTER_TESTS_PORT || 1433
};

// Fixture Model Def
Support.Model = function model(name, def) {
  return {
    identity: name,
    tableName: name,
    datastore: 'test',
    primaryKey: 'id',
    definition: def || Support.Definition
  };
};

// Fixture Table Definition
Support.Definition = {
  id: {
    type: 'number',
    autoMigrations: {
      columnType: '_numberkey',
      autoIncrement: true,
      unique: true
    }
  },
  fieldA: {
    type: 'string',
    autoMigrations: {
      columnType: 'varchar(4000)'
    }
  },
  fieldB: {
    type: 'string',
    autoMigrations: {
      columnType: 'varchar(4000)'
    }
  },
  fieldC: {
    type: 'ref',
    columnName: 'fieldC',
    autoMigrations: {
      columnType: 'varbinary(8000)'
    }
  },
  fieldD: {
    type: 'ref',
    columnName: 'fieldD',
    autoMigrations: {
      columnType: 'datetime'
    }
  },
  fieldE: {
    type: 'int',
    columnName: 'fieldE',
    autoMigrations: {
      columnType: 'int'
    }
  },
  fieldF: {
    type: 'int',
    columnName: 'fieldF',
    autoMigrations: {
      columnType: 'int'
    }
  }
};

// Register and Define a Collection
Support.Setup = function setup(tableName, cb) {
  var collection = Support.Model(tableName);
  var collections = {};
  collections[tableName] = collection;

  var connection = _.cloneDeep(Support.Config);
  connection.identity = 'test';

  // Setup a primaryKey for migrations
  collection.definition = _.cloneDeep(Support.Definition);

  // Build a schema to represent the underlying physical database structure
  var schema = {};
  _.each(collection.definition, function parseAttribute(attributeVal, attributeName) {
    var columnName = attributeVal.columnName || attributeName;

    // If the attribute doesn't have an `autoMigrations` key on it, ignore it.
    if (!_.has(attributeVal, 'autoMigrations')) {
      return;
    }

    schema[columnName] = attributeVal.autoMigrations;
  });

  // Set Primary Key flag on the primary key attribute
  var primaryKeyAttrName = collection.primaryKey;
  var primaryKey = collection.definition[primaryKeyAttrName];
  if (primaryKey) {
    var pkColumnName = primaryKey.columnName || primaryKeyAttrName;
    schema[pkColumnName].primaryKey = true;
  }


  adapter.registerDatastore(connection, collections, function registerCb(err) {
    if (err) {
      return cb(err);
    }

    adapter.define('test', tableName, schema, cb, {});
  });
};

// Just register a connection
Support.registerConnection = function registerConnection(tableNames, cb) {
  var collections = {};

  _.each(tableNames, function processTable(name) {
    var collection = Support.Model(name);
    collections[name] = collection;
  });

  var connection = _.cloneDeep(Support.Config);
  connection.identity = 'test';

  adapter.registerDatastore(connection, collections, cb);
};

// Remove a table and destroy the manager
Support.Teardown = async function teardown(tableName, cb) {
  var manager = adapter.datastores[_.first(_.keys(adapter.datastores))].manager;
  let report = await MSSQL.getConnection({
    manager: manager,
    meta: Support.Config
  });

  var query = util.format('IF OBJECT_ID(\'dbo.%s\') IS NOT NULL BEGIN DROP TABLE %s END;', tableName, tableName);
  await MSSQL.sendNativeQuery({
    connection: report.connection,
    nativeQuery: query
  });

  await MSSQL.releaseConnection({
    connection: report.connection
  });

  adapter.teardown('test', function tearDownCb(err) {
    if (err) {
      return cb(err);
    }
    delete adapter.datastores[_.first(_.keys(adapter.datastores))];
    return cb();
  });
};

// Seed a record to use for testing
Support.Seed = function seed(tableName, cb) {
  var manager = adapter.datastores[_.first(_.keys(adapter.datastores))].manager;
  MSSQL.getConnection({
    manager: manager,
    meta: Support.Config
  }).exec(function getConnectionCb(err, report) {
    if (err) {
      return cb(err);
    }

    var query = [
      'INSERT INTO "' + tableName + '" ("fieldA", "fieldB", "fieldC", "fieldD", "fieldE", "fieldF") ',
      'values (\'foo\', \'bar\', null, null, 2, 1), (\'foo_2\', \'bAr_2\', @p0, @p1, 3, 2);'
    ].join('');

    MSSQL.sendNativeQuery({
      connection: report.connection,
      nativeQuery: query,
      valuesToEscape: [new Buffer.from([1, 2, 3]), new Date('2001-06-15 12:00:00')]
    }).exec(function seedCb(err) {
      if (err) {
        return cb(err);
      }

      MSSQL.releaseConnection({
        connection: report.connection
      }).exec(cb);
    });
  });
};
