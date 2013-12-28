#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var parser = require('../rss/parser');
var config = require('../config.json');

parser(config.rss, function (err, data) {
  if (err) {
    console.log('  Failed.');
    console.log();
    return;
  }
  
  console.log('  Save files');

  var dir = path.join(__dirname, '../data');
  mkdirp.sync(dir);

  console.log('  - articles.json');  
  fs.writeFileSync(path.join(dir, 'articles.json'), JSON.stringify(data.articles));

  Object.keys(data.archive).forEach(function (year) {
    var yearDir = path.join(dir, 'archive', year);
    mkdirp.sync(yearDir);
    Object.keys(data.archive[year]).forEach(function (month) {
      var file = path.join(yearDir, month + '.json');
      console.log('  - ' + file);
      fs.writeFileSync(file, JSON.stringify(data.archive[year][month]));
    });
  });

  console.log();
  console.log('  Done !');
  console.log();
});
