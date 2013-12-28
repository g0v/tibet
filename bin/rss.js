#!/usr/bin/env node

var parser = require('../rss/parser');
var config = require('../config.json');

parser(config.rss);
