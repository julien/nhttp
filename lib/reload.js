'use strict';

var EventEmitter = require('events').EventEmitter
  , path = require('path')
  , tinylr = require('tiny-lr');

var port = process.env.LRPORT || 35729;

module.exports = function () {
  var emitter = new EventEmitter();
  var lr = tinylr();
  lr.server.on('error', function (err) {
    emitter.emit('error', err);

    if (err.code === 'EADDRINUSE') {
      lr = null;
      return;
    }
  });

  return {
    notify: function (filepath) {
      emitter.emit('change', filepath);
      // we need to make it relative to the server root
      filepath = path.relative(__dirname, filepath);
      lr.changed({ body: { files: [filepath] } });
    },
    on: function (event, handler) {
      emitter.on(event, handler);
    },
    off: function (event, handler) {
      emitter.removeListener(event, handler);
    },
    listen: function (p) {
      port = p ? p : port;
      process.env.LRPORT = p;
      lr.listen(p, function () { console.log('Livereload enabled'); });
    },
    close: function () {
      lr.close();
    }
  };
};
