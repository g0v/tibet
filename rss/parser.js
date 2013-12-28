'use strict';

var FeedParser = require('feedparser');
var request = require('request');
var Filter = require('./Filter');
var filter = new Filter();

require('./filters')(filter);

module.exports = function (feeds, cb) {
  var ended = false;
  var articles = [];
  var archive = {};
  var data = {
    articles: articles,
    archive: archive
  };

  var total = 0;
  var done = 0;
  var feedsLen = feeds.length;
  
  var sort = function (a, b) {
    return b.date - a.date;
  };

  var sortData = function () {
    console.log();
    console.log('  Sort');
    console.log();
    articles.sort(sort);
    Object.keys(archive).forEach(function (year) {
      Object.keys(archive[year]).forEach(function (month) {
        archive[year][month].sort(sort);
      });
    });
    cb && cb(null, data);
  };

  var isDone = function () {
    if (total === done) {
      sortData();
    } else {
      setTimeout(isDone, 100);
    }
  };

  feeds.forEach(function (feed) {
    var f = filter.create();

    feed.filters && feed.filters.forEach(function (args) {
      args = args.split('.');
      f.use(args.shift(), args.join('.'));
    });

    request(feed.url)
      .pipe(new FeedParser())
      .on('meta', function (meta) {
        console.log('  %s', meta.title);
      })
      .on('readable', function () {
        total += 1;
        var itemData = this.read();
        var item = {
          title: itemData.title,
          description: itemData.description,
          date: itemData.date,
          pubdate: itemData.pubdate,
          pubDate: itemData.pubDate,
          link: itemData.link,
          guid: itemData.guid,
          author: itemData.author,
          comments: itemData.comments,
          origlink: itemData.origlink,
          image: itemData.image,
          source: itemData.source,
          categories: itemData.categories,
          enclosures: itemData.enclosures,
          meta: {
            copyright: itemData.meta && itemData.meta.copyright,
            title: itemData.meta && itemData.meta.title
          }
        };
        f.start(item, function (keep) {
          if (keep) {
            var year = item.date.getFullYear();
            var month = item.date.getMonth() + 1;
            console.log('  - Got article: %s', item.title);
            articles.push(item);
            year = archive[year] || (archive[year] = {});
            month = year[month] || (year[month] = []);
            month.push(item);
          }
          done += 1;
        });
      })
      .on('error', function (err) {
        if (ended) {
          return;
        }
        ended = true;
        cb && cb(err);
      })
      .on('end', function () {
        feedsLen -= 1;
        if (!feedsLen) {
          !ended && isDone();
        }
      });
  });
};
