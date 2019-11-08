var assert = require('assert');
var Adapter = require('../../../lib/adapter');
var Support = require('../../support/bootstrap-promisified');

describe('Unit Tests ::', function() {
  describe('Count', function() {
    // Test Setup
    before(async function() {
      await Support.Setup('test_sum');
      await Support.Seed('test_sum');
    });

    after(async function() {
      await Support.Teardown('test_sum');
    });


    it('should count the rows', function(done) {
      const query = {
        using: 'test_sum',
        criteria: {
          where: { fieldA: 'foo' }
        }
      };

      Adapter.count('test', query, function(err, result) {
        Support.check(done, err, () => {
          assert(result);
          assert.equal(result, 1);
        });
      });
    });

    // Look into the bowels of the MsSql Driver and ensure the Create function handles
    // it's connections properly.
    it('should release it\'s connection when completed', function(done) {
      var manager = Adapter.datastores.test.manager;
      var preConnectionsAvailable = manager.pool.pool.size;

      var query = {
        using: 'test_sum',
        criteria: {}
      };

      Adapter.count('test', query, (err) => {
        Support.check(done, err, () => {
          var postConnectionsAvailable = manager.pool.pool.size;
          assert.equal(preConnectionsAvailable, postConnectionsAvailable);
        });
      });
    });
  });
});
