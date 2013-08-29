/*global describe: true, it: true*/

'use strict';

var embed = require('../lib/embed.js');

var fs = require('fs');
var expect = require('chai').expect;

var fixturesDir = __dirname + '/fixtures';
var testFile = fixturesDir + '/page.html';
var testFileContent = fs.readFileSync(testFile).toString('utf-8');
var expectedFile = fixturesDir + '/expected.html';
var expected = fs.readFileSync(expectedFile).toString('utf-8');

embed.embed(testFileContent, {root: fixturesDir}, function (err, html) {
  fs.writeFileSync(fixturesDir + '/done.html', html);
});

describe('Node.js Assets Embed', function () {
  it('#embed', function (done) {
    embed.embed(testFileContent, {root: fixturesDir}, function (err, html) {
      expect(html).to.equal(expected);
      done();
    });
  });
  it('#embedFile', function (done) {
    embed.embedFile(testFile, function (err, html) {
      expect(html).to.equal(expected);
      done();
    });
  });

  it('#embedSync', function (done) {
    expect(embed.embedSync(testFileContent, {root: fixturesDir})).to.equal(expected);
    done();
  });
  it('#embedFileSync', function (done) {
    expect(embed.embedFileSync(testFile)).to.equal(expected);
    done();
  });
});
