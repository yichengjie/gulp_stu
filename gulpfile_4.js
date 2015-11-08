var gulp = require('gulp') ;
var seajsCombo = require('gulp-seajs-combo');
var minify = require('gulp-minify');
var seajs = require('gulp-seajs');
var paths = {src:'src/js/*.js'} ;

gulp.task( 'seajscombo', function(){
  return gulp.src( 'src/js/main.js' )
      .pipe( seajsCombo() )
      .pipe( gulp.task('build/js') );
});

gulp.task('build',function(){
    gulp.src(paths.src)
    //.pipe(minify({exclude: ['require','exports','module']  }))
    .pipe(seajs())
    .pipe(gulp.dest('build/'));
}) ;

gulp.task('watchFileChange',function () {
   gulp.watch(paths.src, function(event) {
     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
     gulp.run('build') ;
   });
}) ;

gulp.task('default',['watchFileChange'],function(){
  console.info('gulp任务开始执行！') ;
}) ;
