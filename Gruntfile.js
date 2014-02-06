/*jshint camelcase: false*/

module.exports = function (grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var config = {
    app: 'app',
    dev: 'dev',
    dist: 'dist',
    test: 'test',
    distOptions: {
      clientId: '833c028df47be8e881d9',
      apiScope: 'user, public_repo',
      redirectUri: 'http://dica-developer.github.io/gh-review/',
      accessTokenUrl: 'http://gh-review.herokuapp.com/login/oauth/access_token'
    },
    devOptions: {
      clientId: '5082108e53d762d90c00',
      apiScope: 'user, repo',
      redirectUri: 'http://localhost:9000',
      accessTokenUrl: 'http://gh-review.herokuapp.com/bemdsvdsynggmvweibduvjcbgf'
    }
  };

  grunt.initConfig({
    config: config,
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      dev: {
        options: {
          open: true,
          base: '<%= config.dev %>',
          livereload: false
        }
      }
    },
    watch: {
      options: {
        nospawn: true
      },
      dev: {
        files: [
          '<%= config.app %>/css/*',
          '<%= config.app %>/js/**/*',
          '<%= config.app %>/*.html',
          '<%= config.app %>/templates/**/*',
          '!<%= config.app %>/bower_components/*'
        ],
        tasks: ['devWatch']
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= config.dist %>/*'
            ]
          }
        ]
      },
      dev: {
        files: [
          {
            dot: true,
            src: [
              '<%= config.dev %>/*'
            ]
          }
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: '<%= config.app %>/js/{,*/}*.js'
    },
    less: {
      dev: {
        options: {
          yuicompress: true
        },
        files: {
          '<%= config.dev %>/css/main.css': '<%= config.app %>/css/main.less'
        }
      },
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          '<%= config.dist %>/css/main.css': '<%= config.app %>/css/main.less'
        }
      }
    },
    copy: {
      dev: {
        files: [
          {
            expand: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dev %>',
            src: '**'
          },
          {
            expand: true,
            cwd: '<%= config.app %>/bower_components/bootstrap/dist/fonts',
            dest: '<%= config.dev %>/fonts',
            src: '*'
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dist %>',
            src: ['img/**/*', 'templates/**/*', 'fonts/**/*', '*.html']
          },
          {
            expand: true,
            cwd: '<%= config.app %>/bower_components/bootstrap/dist/fonts',
            dest: '<%= config.dist %>/fonts',
            src: '*'
          },
          {
            expand: true,
            cwd: '<%= config.app %>/bower_components/requirejs',
            dest: '<%= config.dist %>/bower_components/requirejs',
            src: 'require.js'
          }
        ]
      }
    },
    requirejs: {
      options: {
        loglevel: 5,
        findNestedDependencies: true,
        inlineText: true,
        mainConfigFile: 'app/js/main.js'
//        optimizeAllPluginResources: true
      },
      dev: {
        options: {
          dir: '<%= config.dev %>/node-webkit.app/Contents/Resources/app.nw/js',
          optimize: 'none',
          modules: [
            {name: 'main'}
          ]
        }
      },
      dist: {
        options: {
          out: '<%= config.dist %>/js/main.js',
          optimize: 'uglify',
          name: 'main'
        }
      }
    },
    karma: {
      dev: {
        configFile: '<%= config.test %>/dev.karma.conf.js'
      },
      travis: {
        configFile: '<%= config.test %>/travis.karma.conf.js'
      }
    }
  });

  grunt.registerTask('processTmpl', function(target){
    var options = config.distOptions;
    var tmpl = grunt.file.read('build-templates/options.tmpl');
    if('dev' === target){
      options = config.devOptions;
    }
    var processedTmpl = grunt.template.process(tmpl , {data: options});
    grunt.file.write('app/js/options.js', processedTmpl);
  });

  grunt.registerTask('devWatch', [
    'jshint',
    'less:dev',
    'copy:dev'
  ]);

  grunt.registerTask('dev', [
    'clean:dev',
    'jshint',
    'processTmpl:dev',
    'copy:dev',
    'less:dev',
    'connect:dev',
    'watch:dev'
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'jshint',
    'processTmpl:dist',
    'copy:dist',
    'less:dist',
    'requirejs:dist'
  ]);

};