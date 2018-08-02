'use strict';

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    reload = browserSync.reload;

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('sass', function() {
    return gulp.src('assets/scss/style.scss')
      .pipe(sass()) //Compile SASS
      .pipe(autoprefixer({browsers:AUTOPREFIXER_BROWSERS})) //Autoprefix CSS Styles for Browser Compatability
      .pipe(cleanCSS({compatability: 'ie8'}))
      .pipe(gulp.dest('assets/css'))
      .pipe(reload({ stream:true }));
});

gulp.task('scripts', function() {
  return gulp.src('assets/js/scripts.js')
      .pipe(concat('scripts.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('assets/js/'));
});

// watch files for changes and reload
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    https: {
        cert: "ssl/localhost.crt",
        key: "ssl/localhost.key"
    }
  });

  gulp.watch(['*.html', 'assets/css/*.min.css', 'assets/js/*.min.js'], {cwd: './'}).on('change', reload);
});

gulp.task('compile', gulp.parallel('sass', 'scripts'));

gulp.task('default', gulp.parallel('serve', function(done) {
  gulp.watch('assets/scss/*.scss').on('change', gulp.series('sass'));
  gulp.watch('assets/js/scripts.js').on('change', gulp.series('scripts'));
  done();
}));