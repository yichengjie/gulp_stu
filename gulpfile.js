var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');



gulp.task('minify-css', function() {
  return gulp.src('./oc_temp/css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
  return gulp.src('./oc_temp/js/hello.js')
    .pipe(jshint());
    //.pipe(jshint.reporter('YOUR_REPORTER_HERE'));
});

gulp.task('scripts',['lint'], function() {
  return gulp.src(['./oc_temp/js/underscore.js','./oc_temp/js/jquery.js',
      './oc_temp/js/angular.js','./oc_temp/js/bindonce.js',
      './oc_temp/js/jquery.validate.js','./oc_temp/js/messages_zh.js',
      './oc_temp/js/additional-methods.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default',['minify-css','scripts']) ;

/*var gulp = require('gulp')，
    minifycss = require('gulp-minify-css')，
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint=require('gulp-jshint');
    //语法检查
    gulp.task('jshint'， function () {
        return gulp.src('./oc_temp/js/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });
    //压缩css
    gulp.task('minifycss'， function() {
        return gulp.src('./oc_temp/css/*.css')    //需要操作的文件
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(minifycss())   //执行压缩
            .pipe(gulp.dest('Css'));   //输出文件夹
    });
    //压缩，合并 js
    gulp.task('minifyjs'， function() {
        return gulp.src('./oc_temp/js/*.js')      //需要操作的文件
            .pipe(concat('main.js'))    //合并所有js到main.js
            .pipe(gulp.dest('js'))       //输出到文件夹
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(uglify())    //压缩
            .pipe(gulp.dest('Js'));  //输出
    });
　　//默认命令，在cmd中输入gulp后，执行的就是这个任务(压缩js需要在检查js之后操作)
    gulp.task('default',['minifyjs']) ;*/
