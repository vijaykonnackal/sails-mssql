var assert = require('assert');
var _ = require('@sailshq/lodash');
var Adapter = require('../../../lib/adapter');
var Support = require('../../support/bootstrap');

describe('Unit Tests ::', function() {
  describe('CreateEach', function() {
    // Test Setup
    before(function(done) {
      Support.Setup('test_createeach', done);
    });

    after(function(done) {
      Support.Teardown('test_createeach', done);
    });

    // Attributes for the test table
    var attributes = [{
      fieldA: 'foo',
      fieldB: 'bar'
    }, {
      fieldA: 'foo1',
      fieldB: 'bar1'
    }, {
      fieldA: 'foo2',
      fieldB: 'bar2'
    }, {
      fieldA: 'foo3',
      fieldB: 'bar3'
    }];

    it('should insert multiple records into the database and return its fields', function(done) {
      var query = {
        using: 'test_createeach',
        newRecords: attributes,
        meta: {
          fetch: true
        }
      };

      Adapter.createEach('test', query, function(err, result) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(result));
        assert(!_.isFunction(result));
        assert.equal(_.size(result), 4);

        return done();
      });
    });
  });
});
