'use strict';

var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , url = require('url')
  , zlib = require('zlib')
  , mime = require('./mime')
  , snip = require('./snip')
  , currUrl;

function createStream(res, file) {
  var stream
    , pattern = /\.\w+$/
    , type
    , match
    , ext
    , lrport = process.env.LR_PORT || 35729;

  if (typeof file === 'string') {
    match = file.match(pattern);
    ext = match ? match.join('').replace(/\./g, '') : undefined;
    type = !match ? 'binary' : (mime(ext) || 'application/octet-stream');

    stream = fs.createReadStream(file);

    stream.on('error', function (err) {
      res.statusCode = err.statusCode || 500;
      res.end(String(err));
    });

    // Cache headers (7 days)
    var age = 7 * 24 * 60 * 60 * 1000;
    res.setHeader('Cache-Control', 'public, max-age=' + age);
    res.setHeader('Expires', new Date(Date.now() + age).toUTCString());
    // Gzip
    res.writeHead(200, {'Content-Encoding': 'gzip', 'Content-Type': type});
    stream.pipe(snip(lrport)).pipe(zlib.createGzip()).pipe(res);

    return stream;

  } else {
    // it's a buffer
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(file.toString());
  }
}

function listDirectory(res, file) {
  var output = []
    , buffer;

  fs.readdir(file, function (err, files) {
    // if (err) { throw err; }
    output.push('<ul>');

    var i = 0, l = files.length, f;
    for (i = 0; i < l; i += 1) {
      f = files[i];
      if (!(/^\./.exec(f))) {
        output.push('<li><a href=\'' + path.join(currUrl, f) + '\'>' + f + '</a></li>');
      }
    }
    output.push('</ul>');
    buffer = new Buffer(output.join('\n'));
    createStream(res, buffer);
  });
}

function checkIndex(res, file) {
  var f = path.join(file, 'index.html');
  fs.exists(f, function (exists) {
    var location;
    if (exists) {
      location = path.normalize( [currUrl, path.sep, path.basename(f)].join('') );
      res.statusCode = 302;
      res.setHeader('Location', location);
      res.end();
    } else {
      listDirectory(res, file);
    }
  });
}

function checkFile(res, file) {
  fs.stat(file, function (err, stats) {
    if (stats.isDirectory()) {
      checkIndex(res, file);
    } else {
      createStream(res, file);
    }
  });
}

function requestListener(req, res) {
  var uri, file;

  currUrl = req.url;
  uri = decodeURIComponent(url.parse(req.url).pathname);
  file = path.join(process.cwd(), uri);

  fs.exists(file, function (exists) {
    if (exists) {
      checkFile(res, file);
    } else {
      res.writeHead(404);
      res.end('... Error: file not found.');
      return;
    }
  });
}

module.exports = function () {
  return http.createServer(requestListener);
};
