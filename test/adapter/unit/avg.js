var assert = require('assert');
var Adapter = require('../../../lib/adapter');
var Support = require('../../support/bootstrap-promisified');

describe('Unit Tests ::', function() {
  describe('Average', function() {
    // Test Setup
    before(async function() {
      await Support.Setup('test_sum');
      await Support.Seed('test_sum');
    });

    after(async function() {
      await Support.Teardown('test_sum');
    });


    it('should average the rows', function(done) {
      const query = {
        using: 'test_sum',
        numericAttrName: ['fieldE'],
        criteria: {
          where: { fieldA: 'foo' }
        }
      };

      Adapter.avg('test', query, function(err, result) {
        Support.check(done, err, () => {
          assert(result);
          assert.equal(result, 2);
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
        numericAttrName: ['fieldE'],
        criteria: {}
      };

      Adapter.avg('test', query, (err) => {
        Support.check(done, err, () => {
          var postConnectionsAvailable = manager.pool.pool.size;
          assert.equal(preConnectionsAvailable, postConnectionsAvailable);
        });
      });
    });
  });
});
