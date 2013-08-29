/*
 * node-assets-embed
 * https://github.com/LoicMahieu/node-assets-embed
 *
 * Copyright (c) 2013 Loïc Mahieu
 * Licensed under the MIT license.
 */

'use strict';

var cheerio = require('cheerio');
var async = require('async');
var path = require('path');
var fs = require('fs');

var embed = exports.embed = function embed (html, options, cb) {
  if (!options.root) {
    throw new Error('embed need a root option');
  }

  options.encoding = options.encoding || 'utf-8';

  var $ = cheerio.load(html);

  async.parallel([
    // JS
    function (done) {
      async.each($('script[src]'), function (el, done) {
        var $el = $(el);

        fs.readFile(options.root + '/' + $el.attr('src'), options.encoding, function (err, content) {
          if (err) {
            return done(err);
          }

          $el.attr('src', null);
          $el.html(content);

          done();
        });
      }, done);
    },
    // CSS
    function (done) {
      async.each($('link[rel="stylesheet"][href]'), function (el, done) {
        var $el = $(el);

        fs.readFile(options.root + '/' + $el.attr('href'), options.encoding, function (err, content) {
          if (err) {
            return done(err);
          }

          $el.replaceWith("<style>" + content + "</style>");

          done();
        });
      }, done);
    }
  ], function (err) {
    if (err) {
      return cb(err);
    }

    cb(null, $.html());
  });
};

exports.embedFile = function embedFile (htmlFile, options, cb) {
  options.encoding = options.encoding || 'utf-8';
  options.root = options.root || path.dirname(htmlFile);
  fs.readFile(htmlFile, options.encoding, function (err, html) {
    if (err) {
      return cb(err);
    }

    embed(html, options, cb);
  });
};
