var gulp = require('gulp');  
var sass = require('gulp-sass');  
var babel = require('gulp-babel');  
var concat = require('gulp-concat');  
var sourcemaps = require('gulp-sourcemaps');  
var plumber = require('gulp-plumber');

var cssSrc = 'web/static/css/**/*.scss';
var cssDest = 'priv/static/css';

var jsSrc = 'web/static/js/**/*.js*';  
var jsDest = 'priv/static/js';

var viewsSrc = 'web/static/views/**/*.html';
var viewsDest = 'priv/static/views';

function reportChange(event){  
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('build-sass', function() {
  gulp.src(cssSrc)
      .pipe(sass())
      .pipe(concat('app.css'))
      .pipe(gulp.dest(cssDest));
});

gulp.task('build-js', function() {  
  gulp.src(jsSrc)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({sourceMap: true}))
    .pipe(sourcemaps.write({ includeContent: false, sourceRoot: '/web/static/js/' }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(jsDest));
});

gulp.task('build-html', function () {
  gulp.src(viewsSrc)
    .pipe(gulp.dest(viewsDest));
});

gulp.task('build', ['build-html', 'build-js', 'build-sass']);

gulp.task('watch', ['build'], function() {  
  gulp.watch([jsSrc, cssSrc], ['build']).on('change', reportChange);
});

gulp.task('default', ['build']);  
