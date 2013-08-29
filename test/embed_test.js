/*global describe: true, it: true*/

'use strict';

var embed = require('../lib/embed.js');

var fs = require('fs');
var expect = require('chai').expect;

var testFile = __dirname + '/fixtures/page.html';
var expectedFile = __dirname + '/fixtures/expected.html';
var expected = fs.readFileSync(expectedFile).toString('utf-8');

describe('Node.js Assets Embed', function () {
  it('Can embed HTML', function (done) {
    embed.embedFile(testFile, {}, function (err, html) {
      expect(html).to.equal(expected);
      done();
    });
  });
});
