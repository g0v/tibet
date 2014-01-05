#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var RSS = require('rss');
var parser = require('../rss/parser');
var config = require('../config.json');

var readJSONFile = function (file) {
  var exists = fs.existsSync(file);
  return exists ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
};

var baseDir = (process.argv[2] && path.join(process.cwd(), process.argv[2])) || process.cwd();

parser(config.rss, function (err, data) {
  if (err) {
    console.log('  Failed.');
    console.log();
    process.exit(1);
    return;
  }
  
  console.log('  Save files');

  var dir = path.join(baseDir, 'data');
  mkdirp.sync(dir);

  console.log('  - articles.json');  
  fs.writeFileSync(path.join(dir, 'articles.json'), JSON.stringify(data.articles));
  var filesMeta = [];

  Object.keys(data.archive).forEach(function (year) {
    var yearDir = path.join(dir, 'archive', year);
    mkdirp.sync(yearDir);

    Object.keys(data.archive[year]).forEach(function (month) {
      var file = path.join(yearDir, month + '.json');
      var monthData = readJSONFile(file) || [];
      var newMonthData = data.archive[year][month];
      var dedup = [];

      var guid = {};

      monthData.forEach(function (article) {
        guid[article.guid] = 1;
      });

      newMonthData.forEach(function (article) {
        if (!guid[article.guid]) {
          dedup.push(article);
        }
      });

      monthData = dedup.concat(monthData);

      console.log('  - ' + file);
      fs.writeFileSync(file, JSON.stringify(monthData));
      filesMeta.push(file);
    });
  });

  console.log();
  console.log(' Create meta.json');
  fs.writeFileSync(path.join(baseDir, '/data/meta.json'), JSON.stringify(filesMeta));

  console.log();
  console.log(' Create rss.xml');

  config.rssOptions.pubDate = (new Date()).toGMTString();
  var feed = new RSS(config.rssOptions);

  data.articles.slice(20).forEach(function (article) {
    feed.item({
      title: article.title,
      description: article.description,
      url: article.link,
      guid: article.guid,
      author: article.author,
      date: article.date,
      categories: article.categories,
      enclosures: article.enclosures
    });
  });

  fs.writeFileSync(path.join(baseDir, 'rss.xml'), feed.xml());

  console.log();
  console.log('  Done !');
  console.log();
});
