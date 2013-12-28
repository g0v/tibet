'use strict';

var Filter = function () {
  this.filters = {};
};

Filter.prototype.define = function (name, fn) {
  this.filters[name] = fn;
};

Filter.protoytpe.start = function (data) {
  var filter = {};
  filter.__proto__ = this;
  filter.data = data;
  filter.use = [];
  return filter;
};

Filter.prototype.filter = function (name) {
  this.use.push(arguments);
  return this;
};

Filter.prototype.end = function (cb) {
  var use = this.use;
  var data = this.data;
  var newData = [];
  
  var next = function () {
    var item = data.shift();
    var len = use.length;
    var keep = true;
    var itemDone = function (success) {
      len--;
      if (!success) {
        keep = false;
      }
      if (!len && keep) {
        newData.push(item);
      }
    };
    if (item) {
      use.forEach(function (args) {
        var filter = args.shift();
        args.unshift(item);
        args.push(itemDone);
        filter.apply(this, args);
      });
    } else {
      this.data = newData;
      cb && cb.call(this, newData);
    }
  };

  return this;
};

module.exports = Filter;
