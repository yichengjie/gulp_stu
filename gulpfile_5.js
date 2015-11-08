var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

// 静态服务器
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// 代理
//gulp.task('browser-sync', function() {
  //  browserSync.init({
  //      proxy: "你的域名或IP"
  //  });
//});
gulp.task('default',['browser-sync']) ;
