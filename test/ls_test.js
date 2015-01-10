'use strict';

var assert = require('assert')
  , ls = require('../lib/ls');

describe('ls', function () {

  it('should return the contents of a directory', function (done) {

    ls('./test').on('end', function (results) {
      assert.notEqual(results, null);
      assert.deepEqual(Array.isArray(results), true);
      assert.deepEqual(results.length > 0, true);

      done();
    });
  });

  it('should throw if the directory doesnt exist', function (done) {
    ls('../noway').on('error', function (err) {
      assert.notEqual(err, null);
      done();
    });
  });

  it('should work with all args', function (done) {

    ls(null, /^\.|bower_components|node_modules/, '*.md').on('end', function (results) {
      assert.notEqual(results, null);
      assert.deepEqual(Array.isArray(results), true);
      assert.deepEqual(results.length > 0, true);
      done();
    });
  });
});
