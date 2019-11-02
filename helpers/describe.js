//  ██████╗ ███████╗███████╗ ██████╗██████╗ ██╗██████╗ ███████╗
//  ██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██║██╔══██╗██╔════╝
//  ██║  ██║█████╗  ███████╗██║     ██████╔╝██║██████╔╝█████╗
//  ██║  ██║██╔══╝  ╚════██║██║     ██╔══██╗██║██╔══██╗██╔══╝
//  ██████╔╝███████╗███████║╚██████╗██║  ██║██║██████╔╝███████╗
//  ╚═════╝ ╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═════╝ ╚══════╝
//

const util = require('util');

module.exports = require('machine').build({


  friendlyName: 'Describe',


  description: 'Describe a table in the related data store.',


  inputs: {

    datastore: {
      description: 'The datastore to use for connections.',
      extendedDescription: 'Datastores represent the config and manager required to obtain an active database connection.',
      required: true,
      type: 'ref'
    },

    tableName: {
      description: 'The name of the table to describe.',
      required: true,
      example: 'users'
    },

    meta: {
      friendlyName: 'Meta (custom)',
      description: 'Additional stuff to pass to the driver.',
      extendedDescription: 'This is reserved for custom driver-specific extensions.',
      type: 'ref'
    }

  },


  exits: {

    success: {
      description: 'The results of the describe query.',
      outputVariableName: 'records',
      outputType: 'ref'
    },

    badConnection: {
      friendlyName: 'Bad connection',
      description: 'A connection either could not be obtained or there was an error using the connection.'
    }

  },


  fn: function describe(inputs, exits) {
    // Dependencies
    var _ = require('@sailshq/lodash');
    var Helpers = require('./private');

    // Build an object for holding information about the schema
    var dbSchema = {};


    // Set a flag if a leased connection from outside the adapter was used or not.
    var leased = _.has(inputs.meta, 'leasedConnection');


    var schemaName = Helpers.query.schemaName(inputs, inputs);


    //   ██████╗ ██╗   ██╗███████╗██████╗ ██╗███████╗███████╗
    //  ██╔═══██╗██║   ██║██╔════╝██╔══██╗██║██╔════╝██╔════╝
    //  ██║   ██║██║   ██║█████╗  ██████╔╝██║█████╗  ███████╗
    //  ██║▄▄ ██║██║   ██║██╔══╝  ██╔══██╗██║██╔══╝  ╚════██║
    //  ╚██████╔╝╚██████╔╝███████╗██║  ██║██║███████╗███████║
    //   ╚══▀▀═╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
    //
    // These native queries are responsible for describing a single table and the
    // various attributes that make them.

    // Build query to get a bunch of info from the information_schema
    // It's not super important to understand it only that it returns the following fields:
    // [Table, #, Column, Type, Null, Constraint, C, consrc, F Key, Default]
    var describeQuery = util.format('SELECT t.TABLE_SCHEMA, t.TABLE_NAME, c.COLUMN_NAME as \'Column\', c.DATA_TYPE as \'Type\', c.IS_NULLABLE, ' +
      'k.CONSTRAINT_NAME as ConstraintName, tc.CONSTRAINT_TYPE as \'Constraint\', COLUMNPROPERTY(OBJECT_ID(t.TABLE_SCHEMA + \'.\' + t.TABLE_NAME), ' +
      'c.COLUMN_NAME, \'IsIdentity\') as IsIdentity, ' +
      'IsSequence = case when c.COLUMN_DEFAULT like \'%NEXT VALUE FOR%\' then 1 else 0 end ' +
      'from INFORMATION_SCHEMA.TABLES t ' +
      'inner join INFORMATION_SCHEMA.COLUMNS c on c.TABLE_SCHEMA = t.TABLE_SCHEMA and c.TABLE_NAME = t.TABLE_NAME ' +
      'left outer join INFORMATION_SCHEMA.KEY_COLUMN_USAGE k on k.TABLE_NAME = t.TABLE_NAME and k.COLUMN_NAME = c.COLUMN_NAME ' +
      'left outer join INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc on tc.TABLE_SCHEMA = t.TABLE_SCHEMA and tc.TABLE_NAME = t.TABLE_NAME and tc.CONSTRAINT_NAME = k.CONSTRAINT_NAME ' +
      'where t.TABLE_SCHEMA = \'%s\'  and t.TABLE_NAME = \'%s\'', schemaName, inputs.tableName);

    // Get Indexes
    var indiciesQuery = util.format('select c.name as Name ' +
      'from sys.index_columns ic ' +
      'inner join sys.columns c on ic.column_id = c.column_id and c.object_id = ic.object_id ' +
      'where c.object_id = object_id(\'%s.%s\')', schemaName, inputs.tableName);


    //  ╔═╗╔═╗╔═╗╦ ╦╔╗╔  ┌─┐┌─┐┌┐┌┌┐┌┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
    //  ╚═╗╠═╝╠═╣║║║║║║  │  │ │││││││├┤ │   │ ││ ││││
    //  ╚═╝╩  ╩ ╩╚╩╝╝╚╝  └─┘└─┘┘└┘┘└┘└─┘└─┘ ┴ ┴└─┘┘└┘
    // Spawn a new connection to run the queries on.
    Helpers.connection.spawnOrLeaseConnection(inputs.datastore, inputs.meta, function spawnConnectionCb(err, connection) {
      if (err) {
        return exits.badConnection(err);
      }


      //  ╦═╗╦ ╦╔╗╔  ┌┬┐┌─┐┌─┐┌─┐┬─┐┬┌┐ ┌─┐  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
      //  ╠╦╝║ ║║║║   ││├┤ └─┐│  ├┬┘│├┴┐├┤   │─┼┐│ │├┤ ├┬┘└┬┘
      //  ╩╚═╚═╝╝╚╝  ─┴┘└─┘└─┘└─┘┴└─┴└─┘└─┘  └─┘└└─┘└─┘┴└─ ┴
      Helpers.query.runNativeQuery(connection, describeQuery, [], function runDescribeQueryCb(err, describeResults) {
        if (err) {
          // Release the connection on error
          Helpers.connection.releaseConnection(connection, leased, function cb() {
            return exits.error(err);
          });
          return;
        }


        //  ╦═╗╦ ╦╔╗╔  ┬┌┐┌┌┬┐┬┌─┐┬┌─┐┌─┐  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
        //  ╠╦╝║ ║║║║  ││││ ││││  │├┤ └─┐  │─┼┐│ │├┤ ├┬┘└┬┘
        //  ╩╚═╚═╝╝╚╝  ┴┘└┘─┴┘┴└─┘┴└─┘└─┘  └─┘└└─┘└─┘┴└─ ┴
        Helpers.query.runNativeQuery(connection, indiciesQuery, [], function runIndiciesQueryCb(err, indiciesResults) {
          // Ensure the connection is always released back into the pool
          Helpers.connection.releaseConnection(connection, leased, function releaseConnectionCb() {
            if (err) {
              return exits.error(err);
            }

            //  ╔═╗╦═╗╔═╗╔═╗╔═╗╔═╗╔═╗  ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
            //  ╠═╝╠╦╝║ ║║  ║╣ ╚═╗╚═╗  │─┼┐│ │├┤ ├┬┘└┬┘
            //  ╩  ╩╚═╚═╝╚═╝╚═╝╚═╝╚═╝  └─┘└└─┘└─┘┴└─ ┴
            //  ┬─┐┌─┐┌─┐┬ ┬┬ ┌┬┐┌─┐
            //  ├┬┘├┤ └─┐│ ││  │ └─┐
            //  ┴└─└─┘└─┘└─┘┴─┘┴ └─┘

            // Add index flag to schema
            _.each(indiciesResults, function processIndex(column) {
              var key = column.Name;

              // Look through query results and see if key exists
              _.each(describeResults, function extendColumn(column) {
                if (column.Column !== key) {
                  return;
                }

                column.indexed = true;
              });
            });

            // Normalize Schema
            var schema = {};
            _.each(describeResults, function normalize(column) {

              if (_.isUndefined(schema[column.Column])) {
                schema[column.Column] = {
                  type: column.Type
                };
              }

              // Check for Primary Key
              if (column.Constraint === 'PRIMARY KEY') {
                schema[column.Column].primaryKey = true;
              }

              // Check for Unique Constraint
              if (column.Constraint === 'UNIQUE KEY') {
                schema[column.Column].unique = true;
              }

              // Check for autoIncrement
              if (column.IsIdentity) {
                schema[column.Column].autoIncrement = !!column.IsIdentity;
              }

              // Check for index
              if (column.indexed) {
                schema[column.Column].indexed = column.indexed;
              }
            });

            // Set Internal Schema Mapping
            dbSchema = schema;

            // Return the model schema
            return exits.success({ schema: dbSchema });
          }); // </ releaseConnection >
        }); // </ runIndiciesQuery >
      }); // </ runDescribeQuery >
    }); // </ spawnConnection >
  }
});
