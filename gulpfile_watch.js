var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
//var sass        = require('gulp-sass');
var reload      = browserSync.reload;
var minify = require('gulp-minify') ;
// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', function() {
    browserSync.init({
        server: "./"
    });
    //gulp.watch("app/scss/*.scss", ['sass']);
   //gulp.watch("./*.html").on('change', reload);
});
gulp.task('minify',function () {
  gulp.src('./index.js')
  .pipe(minify())
  .pipe(gulp.dest('./build/js/'))
  //当js重新压缩后刷新浏览器
   .pipe(reload({stream:true}));
}) ;
gulp.task('watch',function () {
  gulp.watch('./index.js',function () {
    gulp.run('minify') ;
  }) ;
}) ;
gulp.task('default', ['serve','watch'],function(){
   //监听index文件的变化
   gulp.watch("./*.html").on('change', reload);
});
// scss编译后的css将注入到浏览器里实现更新
//gulp.task('sass', function() {
  //  return gulp.src("app/scss/*.scss")
  //      .pipe(sass())
  //      .pipe(gulp.dest("app/css"))
  //      .pipe(reload({stream: true}));
//});
