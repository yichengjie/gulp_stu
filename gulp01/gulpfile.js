var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var minifycss = require('gulp-minify-css') ;
var uglify = require('gulp-uglify') ;
var rename = require('gulp-rename') ;
var del = require('del');
var buffer = require('gulp-buffer') ;
var jshint = require('gulp-jshint');

var html2js = require('gulp-html2js');


gulp.task('html2js', function() {
    return gulp.src('src/js/tpl/*.html')
        .pipe(html2js('js-demo.js', {
            adapter: 'javascript',
            base: 'templates',
            name: 'js-demo'
        }))
        .pipe(gulp.dest('dist/'));
});



//压缩css
gulp.task('minifycss', function() {
    return gulp.src('src/*.css')      //压缩的文件
        .pipe(gulp.dest('minified/css'))   //输出文件夹
        .pipe(minifycss());   //执行压缩
});

//压缩js
gulp.task('minifyjs', function() {
    return gulp.src('build/js/bundle.js')
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('build/js'));  //输出
});

//执行压缩前，先删除文件夹里的内容
gulp.task('clean', function(cb) {
    del(['build'], cb)
});


gulp.task('bundle', function() {
    return browserify('./src/js/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        /*.pipe(jshint())*/
        .pipe(gulp.dest('./build/js'))//输出bundle.js
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('default',['clean','bundle']) ;


gulp.task('browserify', function() {
    return browserify('./src/js/app.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/js'));//输出bundle.js
});