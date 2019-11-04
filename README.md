# Sails MsSql
[![Build Status](https://travis-ci.org/vijaykonnackal/sails-mssql.svg?branch=master)](https://travis-ci.org/vijaykonnackal/sails-mssql)

A [Waterline](http://waterlinejs.org) adapter for working with the Microsoft SqlServer database.

This version works with Sails 1.x.  All Waterline Adapter Interfaces and methods are implemented based on
 the postgres implementation. 

This is largely a port of [sails-postgresql](https://github.com/balderdashy/sails-postgresql)

## Install
```shell script
$ npm install @vijaykonnackal/sails-mssql
```

## Usage
An example configuration below. 


Check [MsSql Driver Options](https://github.com/tediousjs/node-mssql#connection-pools) and [Tarn Pool Options](https://github.com/vincit/tarn.js/#usage)
for more details. The options are passed verbatim to downstream driver.

```javascript
module.exports.datastores = {
    default: {
        adapter: '@vijaykonnackal/sails-mssql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        schemaName: 'dbo',  //note: schema specified in model takes precedence
        requestTimeout: 15000,
        options: {
            encrypt: false,
            appName: 'myapp'
        },
        pool: {
            max: 25,
            min: 5,
            idleTimeoutMillis: 30000
        } 
    }
};
```

## Help

If you have further questions or are having trouble, click [here](https://github.com/vijaykonnackal/sails-mssql/issues).

## License

The [Sails framework](http://sailsjs.com) is free and open-source under the [MIT License](http://sailsjs.com/license).
