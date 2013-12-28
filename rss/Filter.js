'use strict';

var Filter = function () {
  this.filters = {};
};

Filter.prototype.define = function (name, fn) {
  this.filters[name] = fn;
};

Filter.prototype.create = function () {
  var filter = {};
  filter.__proto__ = this;
  filter.__use = [];
  return filter;
};

Filter.prototype.use = function (name) {
  this.__use.push(arguments);
  return this;
};

Filter.prototype.start = function (item, cb) {
  var use = this.__use;
  var len = use.length;
  var keep = true;

  if (!len) {
    cb && cb(true);
  }

  var itemDone = function (success) {
    len--;
    if (!success) {
      keep = false;
    }
    if (!len) {
      cb && cb(keep);
    }
  };

  use.forEach((function (args) {
    // 複製一份資料，避免對陣列操作後影像之後的判斷
    // 也順便把 arguments 轉 array
    args = Array.prototype.slice.call(args);
    var filter = this.filters[args.shift()];
    args.unshift(item);
    args.push(itemDone);
    filter.apply(this, args);
  }).bind(this));

  return this;
};

module.exports = Filter;
