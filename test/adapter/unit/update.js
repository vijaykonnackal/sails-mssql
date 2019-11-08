var assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();
var _ = require('@sailshq/lodash');
var Adapter = require('../../../lib/adapter');
var Support = require('../../support/bootstrap-promisified');

describe('Unit Tests ::', function() {
  describe('Update', function() {
    // Test Setup
    before(async function() {
      await Support.Setup('test_update');
      await Support.Seed('test_update');
    });

    after(async function() {
      await Support.Teardown('test_update');
    });

    it('should update the correct record', function(done) {
      var query = {
        using: 'test_update',
        criteria: {
          where: {
            fieldA: 'foo'
          }
        },
        valuesToSet: {
          fieldA: 'foobar'
        },
        meta: {
          fetch: true
        }
      };

      Adapter.update('test', query, function(err, results) {
        Support.check(done, err, () => {
          assert(_.isArray(results));
          assert.equal(results.length, 1);
          assert.equal(_.first(results).fieldA, 'foobar');
          assert.equal(_.first(results).fieldB, 'bar');
        });
      });
    });

    it('fetch=false. should update and return nil', function(done) {
      var query = {
        using: 'test_update',
        criteria: {
          where: {
            fieldA: 'foo'
          }
        },
        valuesToSet: {
          fieldB: 'bar2'
        },
        meta: {
          fetch: false
        }
      };

      Adapter.update('test', query, function(err, results) {
        Support.check(done, err, () => {
          should.not.exist(results);
        });
      });
    });

    it('should be case insensitive', function(done) {
      var query = {
        using: 'test_update',
        criteria: {
          where: {
            fieldB: 'bar_2'
          }
        },
        valuesToSet: {
          fieldA: 'foo'
        },
        meta: {
          fetch: true
        }
      };

      Adapter.update('test', query, function(err, results) {
        Support.check(done, err, () => {
          expect(results).to.be.an('array');
          expect(results.length).to.equal(1);
        });
      });
    });

    // Look into the bowels of the MsSql Driver and ensure the Create function handles
    // it's connections properly.
    it('should release it\'s connection when completed', function(done) {
      var manager = Adapter.datastores.test.manager;
      var preConnectionsAvailable = manager.pool.pool.size;

      var query = {
        using: 'test_update',
        criteria: {},
        valuesToSet: {}
      };

      Adapter.update('test', query, function(err) {
        Support.check(done, err, () => {
          var postConnectionsAvailable = manager.pool.pool.size;
          assert.equal(preConnectionsAvailable, postConnectionsAvailable);
        });
      });
    });
  });
});
