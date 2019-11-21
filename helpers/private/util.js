
const _ = require('@sailshq/lodash');

function limit(criteria) {
  if (_.has(criteria, 'limit') && criteria.limit > 2147483647) {
    criteria.limit = 2147483647;
  }
}

module.exports = {
  correctLimit: function correctLimit(criteria) {
    if (_.isArray(criteria)) {
      _.each(criteria, (c) => {
        limit(c);
      });
    } else {
      limit(criteria);
    }
  },

  fixSkipWithNoSort: function fixSkipWithNoSort(criteria, model) {
    if (_.has(criteria, 'skip') && criteria.skip > 0 && _.isEmpty(criteria.sort)) {
      const primaryKeyAttr = model.primaryKey;
      const primaryKeyColumnName = model.definition[primaryKeyAttr].columnName;
      criteria.sort.push({[primaryKeyColumnName]: 'ASC'});
    }
  }
};
