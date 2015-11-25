var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var browserify = require('browserify');  
var source = require('vinyl-source-stream');  
var buffer = require('vinyl-buffer');


gulp.task('browserify', function() {  
  return browserify('./src/main.js')
    .bundle()
    .pipe(source('bundle.js')) // gives streaming vinyl file object
    .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works 
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('lint', function() {
    console.info('hello world gulp ......................') ;
});

//清除文件
gulp.task('clean', function() {
   return gulp.src('./dist/*', {read: false})
    .pipe(clean());
});

gulp.task('scripts', ['clean'],function() {
  return gulp.src(["./bundle.js"])
  	.pipe(jshint())
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest("./dist"));
});


gulp.task('default',['lint','browserify']) ;