//   ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
//  ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
//  ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
//  ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
//  ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
//   ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
//
//  ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗
//  ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗
//  ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝
//  ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗
//  ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║
//  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
//
// Create a new connection manager to use.

var MSSQL = require('@vijaykonnackal/machinepack-mssql');

module.exports = function createManager(url, config, cb) {
  MSSQL.createManager({
    connectionString: url,
    meta: config
  }).exec(function createManagerCb(err, report) {
    if (err) {
      return cb(new Error('There was an error creating the connection manager.\n\n' + err.stack));
    }

    return cb(null, report);
  });
};
