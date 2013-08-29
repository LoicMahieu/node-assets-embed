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


var wrapCData = function (content) {
  return '<![CDATA[ \n' +  content + '\n ]]>';
};

var embed = exports.embed = function embed (html, options, cb) {
  options = options || {};

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
          $el.html(wrapCData(content));

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

var embedSync = exports.embedSync = function embedSync (html, options) {
  options = options || {};

  if (!options.root) {
    throw new Error('embed need a root option');
  }

  options.encoding = options.encoding || 'utf-8';

  var $ = cheerio.load(html);

  // JS
  $('script[src]').each(function (i, el) {
    var $el = $(el);
    var content = fs.readFileSync(options.root + '/' + $el.attr('src')).toString(options.encoding);

    $el.attr('src', null);
    $el.html(wrapCData(content));
  });

  // CSS
  $('link[rel="stylesheet"][href]').each(function (i, el) {
    var $el = $(el);

    var content = fs.readFileSync(options.root + '/' + $el.attr('href')).toString(options.encoding);
    $el.replaceWith("<style>" + content + "</style>");
  });

  return $.html();
};

exports.embedFileSync = function embedFileSync (htmlFile, options) {
  options = options || {};
  options.encoding = options.encoding || 'utf-8';
  options.root = options.root || path.dirname(htmlFile);

  var html = fs.readFileSync(htmlFile).toString(options.encoding);

  return embedSync(html, options);
};

exports.embedFile = function embedFile (htmlFile, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  options.encoding = options.encoding || 'utf-8';
  options.root = options.root || path.dirname(htmlFile);
  fs.readFile(htmlFile, options.encoding, function (err, html) {
    if (err) {
      return cb(err);
    }

    embed(html, options, cb);
  });
};
