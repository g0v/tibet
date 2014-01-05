;(function (window, $, timeline) {
  'use strict';

  timeline.main = function () {
    timeline.init();
  };

  timeline.init = function () {
    timeline.events = [];
    timeline.getElements();
    return timeline.loadMeta()
      .then(function (data) {
        timeline.meta = data;
        timeline.total = data.length;
        timeline.current = timeline.total;
      })
      .then(timeline.load);
  };

  timeline.getElements = function () {
    timeline.$timelineEvents = $('.timeline__events');
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
    if (timeline.current) {
      $.get(timeline.meta[--timeline.current])
        .then(function (data) {
          timeline.events = timeline.events.concat(data);
          timeline.createEvents(data);
        }, deferred.reject);
    } else {
      deferred.resolve();
    }
    return deferred.promise();
  };

  timeline.createEvents = function (events) {
    var html = '';
    events.forEach(function (evt) {
      html += '<li class="timeline__events__item">' + evt.title;
    });
    timeline.$timelineEvents.append(html);
  };

  window.onload = function () {
    timeline.main();
  };
})(this, jQuery, {});
