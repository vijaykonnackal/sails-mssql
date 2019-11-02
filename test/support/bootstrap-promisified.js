const Support = require('./bootstrap');
const promisify = require('util').promisify;

module.exports = {
  Config: Support.Config,
  Model: Support.Model,
  Definition: Support.Definition,
  Setup: promisify(Support.Setup),
  registerConnection: promisify(Support.registerConnection),
  Teardown: promisify(Support.Teardown),
  Seed: promisify(Support.Seed)
};
