'use strict';

var EventEmitter = require('events').EventEmitter
  , readdirp = require('readdirp')
  , es = require('event-stream');

var defaultExcludes = /bower_components|coverage|node_modules|test|^\.\w+/;
var defaultFilter = '*.*';

module.exports = function (filepath, excludes, filter) {
  var emitter = new EventEmitter();
  var fp = filepath ? filepath : process.cwd();
  var ex = excludes && excludes instanceof RegExp ? excludes : defaultExcludes;
  var fl = filter ? filter : defaultFilter;
  var results = [];
  var stream = readdirp({root: fp, fileFilter: fl});
  stream
    .on('error', function (err) {
      emitter.emit('error', err);
    })
    .on('end', function () {
      emitter.emit('end', results.slice());
    })
    .pipe(es.map(function (data, cb) {
      if (!(ex.exec(data.path))) {
        results.push(data.path);
      }
      cb(null, results);
    }))
    .pipe(es.stringify());

  return emitter;
};

