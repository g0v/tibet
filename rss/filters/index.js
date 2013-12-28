'use strict';

var fs = require('fs');
var path = require('path');
var isJsFile = /\.js$/;

module.exports = function (filter) {
  var files = fs.readdirSync(__dirname);
  files.forEach(function (file) {
    if (file === 'index.js' || !isJsFile.test(file)) {
      return;
    }
    file = path.join(__dirname, file);
    require(file)(filter);
  });
};
