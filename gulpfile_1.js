var gulp = require('gulp');
var tpl2js = require('gulp-tpl2js') ;

var paths = {tpl:'./tpl/*.*'} ;

gulp.task('tpl2js', function() {
  gulp.src(paths.tpl)
    .pipe(tpl2js({type:'cmd',modBase: 'tpl'}))
    .pipe(gulp.dest('./output/tpl'))
});

gulp.task('default',['tpl2js'], function() {
  console.info('hello world') ;
});
