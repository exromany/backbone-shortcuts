# Generated on 2014-12-24 using generator-bower 0.0.1
'use strict'

mountFolder = (connect, dir) ->
    connect.static require('path').resolve(dir)

module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  yeomanConfig =
    src: 'src'
    dist : 'dist'
  grunt.initConfig
    yeoman: yeomanConfig

    coffee:
      options:
        bare: true
      dist:
        files: [
          expand: true
          cwd: '<%= yeoman.src %>'
          src: '{,*/}*.coffee'
          dest: '<%= yeoman.dist %>'
          ext: '.js'
        ]

    uglify:
      build:
        src: '<%=yeoman.dist %>/backbone-shortcuts.js'
        dest: '<%=yeoman.dist %>/backbone-shortcuts.min.js'

    grunt.registerTask 'default', [
      'coffee'
      'uglify'
    ]
