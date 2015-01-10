'use strict';

var assert = require('assert')
  , fs = require('fs')
  , reload = require('../lib/reload');

describe('reload', function () {

  var rld = reload();

  beforeEach(function () {
    rld.listen(35729);
  });

  afterEach(function () {
    rld.close();
  });

  it('should create an reload object', function () {
    assert.notDeepEqual(rld, null);
  });

  it('should watch for file changes', function (done) {
    var f = 'tmp.txt';

    rld.on('change', function (filepath) {
      assert.deepEqual(f, filepath);
      fs.unlinkSync(f);
      done();
    });

    var s = fs.createWriteStream(f);
    s.write('Hello');
    s.end();
    rld.notify(f);
  });

  it('should watch for file changes', function () {
    // just testing off doesnt break
    rld.off('change', function (){});
  });

});
