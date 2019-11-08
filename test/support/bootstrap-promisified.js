const Support = require('./bootstrap');
const promisify = require('util').promisify;
const _ = require('@sailshq/lodash');

module.exports = {
  Config: Support.Config,
  Model: Support.Model,
  Definition: Support.Definition,
  Setup: promisify(Support.Setup),
  registerConnection: promisify(Support.registerConnection),
  Teardown: promisify(Support.Teardown),
  Seed: promisify(Support.Seed),
  check: function(done, err, f) {
    if (_.isFunction(err)) {
      f = err;
    } else {
      if (err) {
        return done(err);
      }
    }

    try {
      f();
      return done();
    } catch (e) {
      return done(e);
    }
  }
};
