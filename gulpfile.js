/*global pipe*/
var gulp = require('gulp');
var gutil = require('gulp-util');
var lessc = require('gulp-less');
var minifycss = require('gulp-minify-css');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var es = require('event-stream');
var Q = require('q');

var resourcesBasePath = './resources/node-webkit/';
var devBasePath = './dev/GH-Review.app/';
var appBasePath = './app/';

gulp.task('clean', function(){
  'use strict';

  return gulp.src(devBasePath, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('copyToDev', ['clean'], function(){
  'use strict';

  return es.concat(
    gulp.src(resourcesBasePath + 'mac-os/node-webkit.app/**/*')
    .pipe(gulp.dest(devBasePath)),
    gulp.src(appBasePath + 'bower_components/requirejs/require.js')
    .pipe(gulp.dest(devBasePath + 'Contents/Resources/app.nw/bower_components/requirejs')),
    gulp.src([
      appBasePath + 'bower_components/bootstrap/dist/fonts/*',
      appBasePath + 'fonts/**/*'
    ])
    .pipe(gulp.dest(devBasePath + 'Contents/Resources/app.nw/fonts')),
    gulp.src(appBasePath + 'img/**/*')
      .pipe(gulp.dest(devBasePath + 'Contents/Resources/app.nw/img')),
    gulp.src(appBasePath + 'node_modules/**/*')
    .pipe(gulp.dest(devBasePath + 'Contents/Resources/app.nw/node_modules')),
    gulp.src(appBasePath + 'templates/**/*')
    .pipe(gulp.dest(devBasePath + 'Contents/Resources/app.nw/templates')),
    gulp.src(appBasePath + 'views/**/*')
    .pipe(gulp.dest(devBasePath + 'Contents/Resources/app.nw/views')),
    gulp.src(appBasePath + 'package.json')
      .pipe(gulp.dest(devBasePath + 'Contents/Resources/app.nw'))
  );
});

gulp.task('permissions', function(){
  'use strict';
  var deferred = Q.defer();

  var fs = require('fs');
  fs.chmodSync(devBasePath + 'Contents/Frameworks/node-webkit Helper EH.app/Contents/MacOS/node-webkit Helper EH', '555');
  fs.chmodSync(devBasePath + 'Contents/Frameworks/node-webkit Helper NP.app/Contents/MacOS/node-webkit Helper NP', '555');
  fs.chmodSync(devBasePath + 'Contents/Frameworks/node-webkit Helper.app/Contents/MacOS/node-webkit Helper', '555');
  fs.chmodSync(devBasePath + 'Contents/MacOS/node-webkit', '555');
  deferred.resolve();
  return deferred.promise;
});

gulp.task('less', ['copyToDev'], function(){
  'use strict';

  return gulp.src('./app/css/*.less')
    .pipe(lessc())
    .pipe(minifycss())
    .pipe(gulp.dest(devBasePath + 'Contents/Resources/app.nw/css'));
});

gulp.task('jshint', ['copyToDev'], function(){
  'use strict';

  return gulp.src(appBasePath + 'js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('script', ['jshint', 'copyToDev'], function(){
  'use strict';

  return gulp.src(appBasePath)
    .pipe(rjs({
      baseUrl: appBasePath + 'js',
      out: 'main.js',
      name: 'main',
      loglevel: 5,
      findNestedDependencies: true,
      inlineText: true,
      mainConfigFile: appBasePath + 'js/main.js'
    }))
  .pipe(uglify())
  .pipe(gulp.dest(devBasePath + 'Contents/Resources/app.nw/js'));
});

gulp.task('default', ['less', 'script'], function(){
  'use strict';

  gulp.run('permissions', function(){
    var exec = require('child_process').exec;
    var app = exec(devBasePath + 'Contents/MacOS/node-webkit');
    app.stdout.on('data', function(msg){
      console.log(msg);
  //    notify({message: msg});
    });
    app.stderr.on('data', function(msg){
      console.log(msg);
  //    notify({message: msg});
    });
  });

});
