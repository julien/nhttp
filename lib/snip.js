'use strict';

var util = require('util')
  , Transform = require('stream').Transform;

var html = '<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':$PORT/livereload.js?snipver=1"></\' + \'script>\');</script>';

function Snippet(options) {
  this._port = options.port;
  Transform.call(this, options);
}
util.inherits(Snippet, Transform);

Snippet.prototype._transform = function(chunk, encoding, callback) {
  var p = this.generate(this._port);
  var chunkStr = chunk.toString().replace(/(<\/body>)/g, function () {
    return p.concat('\n').concat(RegExp.$1);
  });
  callback(null, new Buffer(chunkStr, 'utf-8'));
};

Snippet.prototype.generate = function (port) {
  return html.replace('\$PORT', port);
};

module.exports = function (port) {
  return new Snippet({port: port || '35729'});
};
