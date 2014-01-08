;(function (window, $, timeline) {
  'use strict';

  timeline.main = function () {
    timeline.init();
  };

  timeline.init = function () {
    timeline.events = [];
    timeline.getElements();
    timeline.eventsLength = 0;
    return timeline.loadMeta()
      .then(function (data) {
        timeline.meta = data;
        timeline.total = data.length;
        timeline.current = timeline.total;
      })
      .then(timeline.load)
      .then(timeline.bindEvents);
  };

  timeline.getElements = function () {
    timeline.$win = $(window);
    timeline.$timelineEvents = $('.timeline');
    timeline.$doc = $(document);
  };

  timeline.bindEvents = function () {
    timeline.$win.on('scroll', timeline.winScrollHandler);
  };
  
  timeline.winScrollHandler = function () {
    if (!timeline.stopped && timeline.$win.scrollTop() + timeline.$win.height() > timeline.$doc.height() - 200) {
      timeline.load();
    }
  };

  timeline.loadMeta = function () {
    return $.get('./data/meta.json');
  };

  // timeline.loadJson('2013/9')
  timeline.loadJson = function (ym) {
    var base = './data/archive/';
    ym = (ym || '')
      .replace(/[-\.]/, '/')
      .replace(/\/0/, '/');
    return $.get(base + ym);
  };

  timeline.load = function () {
    var deferred = $.Deferred();
    if (timeline.loading) {
      var err = new Error('ignore request');
      err.ignore = true;
      deferred.reject(err);
    } else {
      timeline.loading = true;
      if (timeline.current) {
        $.get('.' + timeline.meta[--timeline.current])
          .then(function (data) {
            timeline.events = timeline.events.concat(data);
            timeline.createEvents(data);
            timeline.loading = false;
            deferred.resolve();
            timeline.winScrollHandler();
          }, deferred.reject);
      } else {
        timeline.stopped = true;
        deferred.resolve();
      }
    }
    return deferred.promise();
  };

  timeline.createEvents = function (events) {
    var html = '';
    var template = '<article class="article {{__class}}"><div class="container"><h1 class="article__title"><a href="{{link}}">{{title}}</a></h1><div class="article__meta"><span class="article__time">{{__date}}</span><span class="article__from">{{__metaTitle}}</span></div><div class="article__entry">{{description}}</div></div></article>';
    events.forEach(function (evt) {
      evt.__class = timeline.eventsLength % 2 ? 'article--even' : 'article--odd';
      evt.__date = (new Date(evt.pubdate)).toDateString();
      evt.__metaTitle = evt.meta.title;
      html += timeline.template(template, evt);
      timeline.eventsLength++;
    });
    timeline.$timelineEvents.append(html);
  };

  timeline.template = function (template, data) {
    return template.replace(/{{([^}]+)}}/g, function (origin, key) {
      key = key.trim();
      if (data.hasOwnProperty(key)) {
        return timeline.strip(data[key], '<p><br><br/><a>');
      }
      return origin;
    });
  };

  // from https://github.com/kvz/phpjs/blob/master/functions/strings/strip_tags.js
  timeline.strip = function (input, allowed) {
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
  };

  window.timeline = timeline;
})(this, jQuery, {});

window.onload = function () {
  timeline.main();
};
