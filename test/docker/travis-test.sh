#!/bin/bash
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i /sails-sqlserver-adapter/sqlserver.setup.sql
