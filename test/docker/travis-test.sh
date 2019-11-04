#!/bin/bash
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i /sails-mssql/sqlserver.setup.sql
