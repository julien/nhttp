'use strict';

var assert = require('assert')
  , http = require('http')
  , server = require('../lib/server');

describe('server', function () {

  // this.timeout(15000);

  var srv = server();

  beforeEach(function () {
    srv.listen(3333);
  });
  afterEach(function () {
    srv.close();
  });

  it('should create an http.Server', function () {
    assert.deepEqual(srv instanceof http.Server, true);
  });

  it('should response to GET requests', function (done) {

    http.get('http://localhost:3333/', function(res) {
      assert.notEqual(res.statusCode, 0);

      var buf = [];
      res.on('data', function (chunk) {
        buf.push(chunk.toString());
      });

      res.on('end', function () {
        buf = buf.join('\n');

        assert.notDeepEqual(buf, null);

        done();
      });
    });

  });

  it('should handle 404s', function (done) {
    http.get('http://localhost:3333/non-existing-url', function (res) {
      assert.deepEqual(res.statusCode, 404);
      done();
    });
  });

  it('should stream back file requests', function (done) {
    http.get('http://localhost:3333/readme.md', function (res) {
      assert.deepEqual(res.statusCode, 200);
      done();
    });
  });

  it('should allow visiting directories', function (done) {
    http.get('http://localhost:3333/test/fixtures', function (res) {

      assert.deepEqual(res.headers['location'], '/test/fixtures/index.html');
      assert.notEqual(res.statusCode, 404);

      done();
    });
  });

  it('should handle non-existing file requests', function (done) {
    http.get('http://localhost:3333/foo/bar/baz/qux.zip', function (res) {
      assert.deepEqual(res.statusCode, 404);
      done();
    });
  });

  it('should handle non-existing mime type', function (done) {
    http.get('http://localhost:3333/test/fixtures/somefile', function (res) {
      var ct = res.headers['content-type'];
      assert.deepEqual(ct, 'binary');
      done();
    });
  });

});
