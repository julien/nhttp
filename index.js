'use strict';

var os = require('os')
  , path = require('path')
  , gaze = require('gaze')
  , server = require('./lib/server')
  , reload = require('./lib/reload')
  , ls = require('./lib/ls');

var sport = 9000;
var rport = 35729;
var srv;
var rld;
var root;

var args = process.argv.slice(2);
while (args.length > 0) {
  var arg = args.shift();
  switch (arg) {
  case '-d': root = path.resolve(args.shift()); process.chdir(root); break;
  case '-p': var p = parseInt(args.shift(), 10); if (p) sport = p; break;
  }
}

process.on('uncaughtException', function (err) { console.log('ERROR:%s', err); });

process.on('SIGINT', function () {
  if (srv) srv.close();
  if (rld) rld.close();
  process.exit(1);
});

// server
srv = server();
srv.on('close', function () {
  console.log('Bye!');
});
srv.on('error', function (err) {
  if (err.code === 'EACCES' || err.code === 'EADDRINUSE') {
    console.error('... Failed starting server on port', sport);
    process.kill();
  }
});
srv.on('listening', function () {
  console.log('Http Server listening on port', sport);
  console.log('\t<C-c> to exit.');
});
srv.listen(sport);

// livereload
rld = reload();
rld.listen(rport);

// watcher
ls('./').on('end', function (results) {
  gaze(results, function (err, watcher) {
    watcher.on('changed', function (filepath) {
      rld.notify(filepath);
    });
  });
});

