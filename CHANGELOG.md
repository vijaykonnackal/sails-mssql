# Sails SqlServer Adapter Changelog

### v2.0.0
* Renamed forked repo to sails-sqlserver-adapter
* Ported Sails Postgresql to work with MsSql
* Added additional tests for aggregate functions - count, avg, sum
* JSON columtype values are stringified before storage and parsed to JSON on retrieval
* bigint columntype values are converted to string as large bigint values causes mssql driver to throw error
* Datatypes adjusted for schemabuild.
* The default value for limit value passed to the adapter from waterline is too big. It is reset to 2147483647 if it is greater than that.
* unionAll query corrected to have the order by clause outside the union statements. Wrapping braces are removed if the join array contains only 1 record
* Migratable interface is NOT supported yet.
* While using skip clause, SQL Server mandates a sort clause. If no sort clause is present add a sort by with the model's primary key.

### v1.0.2
Forked from [sails-postgresql](https://github.com/balderdashy/sails-postgresql)
