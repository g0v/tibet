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
  console.log();

  var dir = path.join(__dirname, '../data');

  mkdirp.sync(dir);

  fs.writeFileSync(path.join(dir, 'articles.json'), JSON.stringify(data.articles));
  fs.writeFileSync(path.join(dir, 'archive.json'), JSON.stringify(data.archive));

  console.log('  Done !');
  console.log();
});
