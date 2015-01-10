'use strict';

var assert = require('assert')
  , path = require('path')
  , fs = require('fs')
  , stream = require('stream')
  , snip = require('../lib/snip');

var expected = fs.readFileSync(path.join(__dirname + path.sep + 'fixtures/snip.html'), 'utf8').trim();

describe('snip', function () {

  it('should transform stream', function (done) {

    var rs = new stream.Readable();
    rs.push('<!doctype html>\n');
    rs.push('<html>\n');
    rs.push('<head></head>\n');
    rs.push('<body>\n');
    rs.push('</body>\n');
    rs.push('</html>');
    rs.push(null);

    var st = rs.pipe(snip('35729'));
    var res = [];

    st.on('data', function (chunk, encoding) {
      res.push(chunk.toString(encoding));
    });

    st.on('finish', function () {
      res = res.join('').trim();
      assert.equal(expected, res);
      done();
    });
  });

  it('should work even if not opts are given', function (done) {

    var rs = new stream.Readable();
    rs.push('<!doctype html>\n');
    rs.push('<html>\n');
    rs.push('<head></head>\n');
    rs.push('<body>\n');
    rs.push('</body>\n');
    rs.push('</html>');
    rs.push(null);

    var st = rs.pipe(snip());
    var res = [];

    st.on('data', function (chunk, encoding) {
      res.push(chunk.toString(encoding));
    });

    st.on('finish', function () {
      res = res.join('').trim();
      assert.equal(expected.length, res.length);
      done();
    });
  });
});
