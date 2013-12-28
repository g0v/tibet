'use strict';

var FeedParser = require('feedparser');
var request = require('request');
var Filter = require('./Filter');
var filter = new Filter();

require('./filters')(filter);

module.exports = function (feeds) {
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
        var item = this.read();
        f.start(item, function () {
          console.log('  - Got article: %s', item.title);
        });
      })
  });
};
