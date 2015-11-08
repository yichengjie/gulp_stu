var gulp = require('gulp') ;
var browserSync = require('browser-sync').create() ;
var reload      = browserSync.reload;

gulp.task('serve', function() {
    browserSync.init({
        server: "./"
    });
});

gulp.task('watch',function () {
  gulp.watch('./jquery_01/*.*',function (event) {
    gulp.src('./jquery_01/index.html')
    .pipe(reload({stream:true})) ;
    console.info('file ' + event.path +" 发生了 " + event.type) ;
  }) ;
}) ;

gulp.task('default',['serve','watch']) ;
