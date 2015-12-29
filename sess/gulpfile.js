var gulp = require('gulp') ;
var sass = require('gulp-sass') ;
var autoprefixer = require('gulp-autoprefixer') ;
var minifycss = require('gulp-minify-css') ;
var  rename = require('gulp-rename') ;
var  notify = require('gulp-notify') ;


var path = {src:"./nice-select.scss",dist:"../select_nice/"} ;

// Styles任务
gulp.task('styles', function() {
    //编译sass
    return gulp.src(path.src)
    .pipe(sass())
    //添加前缀
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //保存未压缩文件到我们指定的目录下面
    .pipe(gulp.dest(path.dist))
    //给文件添加.min后缀
    .pipe(rename({ suffix: '.min' }))
    //压缩样式文件
    .pipe(minifycss())
    //输出压缩文件到指定目录
    .pipe(gulp.dest(path.dist));
    //提醒任务完成
    /*.pipe(notify({ message: 'Styles task complete' }));*/
});

gulp.task('default',['styles']) ;


