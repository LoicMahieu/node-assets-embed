'use strict';

module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'list',
          timeout: 30000
        },
        src: ['test/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: 'coverage.html'
        },
        src: ['test/*.js']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochaTest']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'nodeunit']);

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

};
