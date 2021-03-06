'use strict';

module.exports = function (filter) {
  filter.define('keyword', function (item, arg, done) {
    var keywords = arg.split('.');
    var regexp = new RegExp('/(' + keywords.join('|') + ')/');
    done(null, regexp.test(JSON.stringify(item)));
  });
};
