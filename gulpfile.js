var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


var paths = {src:{js:"./oc_temp/js/",css:"./oc_temp/css/"},dist:"./dist/oc_temp/"} ;

/*gulp.task('minifyjs', function() {
    return gulp.src('src/*.js')
        .pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest('minified/js'))    //输出main.js到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('minified/js'));  //输出
});*/

/*gulp.task('clean', function(cb) {
    del(['minified/css', 'minified/js'], cb)
});*/

gulp.task('minify-css', function() {
  return gulp.src(paths.src.css+'*.css')
    .pipe(concat('app.min.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('lint', function() {
  return gulp.src(paths.src.js+'hello.js')
    .pipe(jshint());
    //.pipe(jshint.reporter('YOUR_REPORTER_HERE'));
});

gulp.task('scripts',['lint'], function() {
  return gulp.src([paths.src.js+'underscore.js',paths.src.js+'jquery.js',
      paths.src.js+'angular.js',paths.src.js+'bindonce.js',
      paths.src.js+'jquery.validate.js',paths.src.js+'messages_zh.js',
      paths.src.js+'additional-methods.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
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
