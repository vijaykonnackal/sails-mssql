//   ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗██╗     ███████╗
//  ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║██║     ██╔════╝
//  ██║     ██║   ██║██╔████╔██║██████╔╝██║██║     █████╗
//  ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║██║     ██╔══╝
//  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ██║███████╗███████╗
//   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝
//
//  ███████╗████████╗ █████╗ ████████╗███████╗███╗   ███╗███████╗███╗   ██╗████████╗
//  ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝████╗ ████║██╔════╝████╗  ██║╚══██╔══╝
//  ███████╗   ██║   ███████║   ██║   █████╗  ██╔████╔██║█████╗  ██╔██╗ ██║   ██║
//  ╚════██║   ██║   ██╔══██║   ██║   ██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║
//  ███████║   ██║   ██║  ██║   ██║   ███████╗██║ ╚═╝ ██║███████╗██║ ╚████║   ██║
//  ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
//
// Transform a Waterline Query Statement into a SQL query.

var MSSQL = require('@vijaykonnackal/machinepack-mssql');

module.exports = function compileStatement(statement) {
  var report = MSSQL.compileStatement({
    statement: statement
  }).execSync();

  return report;
};
