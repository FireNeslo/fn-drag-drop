var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var selenium = require('gulp-mocha-selenium');
var pkg = require('./package.json')

gulp.task('default', ['build'])

gulp.task('build', ['main', 'angular', 'jquery', 'polyfill']);

gulp.task('main', function () {
  var bundler = browserify({
    entries: pkg.main,
    standalone: 'fnDragDrop'
  });
  return bundler.bundle()
    .pipe(source(pkg.name+'.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build/'))
    .pipe(gulp.dest('./demo/'));
})

gulp.task('angular', function () {
  var bundler = browserify({
    entries: './lib/angular/index.js'
  });
  return bundler.bundle()
    .pipe(source(pkg.name+'-angular.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build/'))
    .pipe(gulp.dest('./demo/angular'));
})

gulp.task('polyfill', function () {
  var bundler = browserify({
    entries: './lib/polyfill/index.js'
  });
  return bundler.bundle()
    .pipe(source(pkg.name+'-polyfill.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build/'))
    .pipe(gulp.dest('./demo/polyfill'));
})

gulp.task('jquery', function () {
  var bundler = browserify({
    entries: './lib/jquery/index.js'
  });
  return bundler.bundle()
    .pipe(source(pkg.name+'-jquery.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build/'))
    .pipe(gulp.dest('./demo/jquery'));
})

gulp.task('test', function (argument) {
  return gulp.src('test/**/*.js')
    .pipe(selenium({usePromises: true}))
})

gulp.task('watch',['build'], function() {
  gulp.watch(['index.js','lib/**'], ['build'])
})
