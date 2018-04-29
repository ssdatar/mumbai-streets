const gulp = require('gulp'),
    argv = require('yargs').argv,
    rename = require('gulp-rename'),
    buffer = require('vinyl-buffer'), // Vinyl is an interface between browserify and gulp
    livereload = require('gulp-livereload'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    bs = require('browser-sync'),
    babelify = require('babelify'),
    webserver = require('gulp-webserver'),
    merge = require('merge-stream'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    path   = require('path'),
    concat = require('gulp-concat'),
    jsonminify = require('gulp-jsonminify'),
    ghPages = require('gulp-gh-pages');

var SRC = './assets/';
var PROD = './dist/prod/';
var DEV = './dist/dev/';

var STAGING_BUCKET = '';
var PROD_BUCKET = '';
var STAGING_SUBDIR = '';
var PROD_SUBDIR = '';

var ENV = argv.production ? PROD : DEV;

var browserSync = {
  port: 8080,
  server: {
    baseDir: ENV,
  }
}

gulp.task('bundle', function() {
  var b = browserify({
    entries: [SRC + 'js/index.js'],
    debug: true,
    transform: [babelify.configure({
      presets: ['env']
    })]
  });

  return bundle = b.bundle()
    .on('error', function(err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(source(SRC + 'js/index.js'))
    .pipe(buffer())
    .pipe(rename('main.js'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(ENV));
});

gulp.task('compile', gulp.series('bundle', function(done) {
  if (ENV === PROD) {
    return gulp.src(ENV + 'main.js')
      .pipe(uglify())
      .pipe(gulp.dest(ENV))
  }
  done();
}));

gulp.task('sass', function(){
  return gulp.src([SRC + 'css/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({includePaths: ['node_modules/foundation-sites/scss']})) // Using gulp-sass
    .pipe(sourcemaps.write())
    // .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest(ENV + 'css/'));
});

gulp.task('build-assets', function() {
  var html = gulp.src([SRC + '*.html', SRC + 'favicon.ico'])
  .pipe(gulp.dest(ENV));

  var lib = gulp.src(SRC + 'js/lib.js')
  .pipe(gulp.dest(ENV));

  var images = gulp.src([SRC + 'img/**'])
    .pipe(gulp.dest(ENV + 'img'));

  var data = gulp.src(SRC + 'data/streets.json')
    // .pipe(jsonminify())
    .pipe(gulp.dest(ENV + 'data'));

  var css = gulp.src(ENV + 'css/style.css')
    .pipe(cssnano())
    .pipe(gulp.dest(function(file){
      return file.base; //replace current file
    }));

  return merge(html, lib, images, css, data); // Merge emits events from multiple streams
})

gulp.task('watch', function(done) {
  gulp.watch(SRC + 'css/*.scss', gulp.series('sass'));

  gulp.watch(SRC + 'js/*.js', gulp.series('compile'));

  gulp.watch([SRC + 'img/*', SRC + '*.html'], gulp.series('build-assets'));
  done();
});

gulp.task('serve', gulp.series('sass', 'compile', 'build-assets', 
'watch', function() {
  bsIns = bs.create();
  bsIns.init(browserSync);
  bsIns.reload();
  console.log('Serving from ' + ENV)
}));

gulp.task('build', gulp.series('sass', 'compile', 'build-assets', function(done) {
  done();
}));

gulp.task('publish', function(){
  return gulp.src('./dist/prod/**/*')
    .pipe(ghPages());
});

gulp.task('deploy', gulp.series('build', 'publish', function(done){
  done();
}));