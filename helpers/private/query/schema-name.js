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

const _ = require('@sailshq/lodash');

module.exports = function schemaName(inputs, query) {

  //  ╔═╗╦ ╦╔═╗╔═╗╦╔═  ┌─┐┌─┐┬─┐  ┌─┐  ┌─┐┌─┐┬ ┬┌─┐┌┬┐┌─┐
  //  ║  ╠═╣║╣ ║  ╠╩╗  ├┤ │ │├┬┘  ├─┤  └─┐│  ├─┤├┤ │││├─┤
  //  ╚═╝╩ ╩╚═╝╚═╝╩ ╩  └  └─┘┴└─  ┴ ┴  └─┘└─┘┴ ┴└─┘┴ ┴┴ ┴
  // It may be passed in on a query by query basis using the meta input or configured
  // on the datastore. Default to use the public schema.

  var schemaName = 'dbo';
  if (_.has(query.meta, 'schemaName')) {
    schemaName = query.meta.schemaName;
  } else if (inputs.datastore.config && inputs.datastore.config.schemaName) {
    schemaName = inputs.datastore.config.schemaName;
  }
  return schemaName;
};
