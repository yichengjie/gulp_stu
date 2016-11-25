var gulp = require( 'gulp' ) ;
var seajsCombo = require( 'gulp-seajs-combo' ) ;

var ignoreArr = ['jquery','tuiValidator','datepicker','tuiDialog',
                'underscore','jqueryuitimepickeraddon'] ;

gulp.task( 's7queryMain', function(){
    return gulp.src( './src/s7queryMain.js' )
        .pipe( seajsCombo({
            ignore : ignoreArr
        }) )
        .pipe( gulp.dest('build') );
});

gulp.task( 's7edit', function(){
    return gulp.src( './src/edit/main.js' )
        .pipe( seajsCombo({
            ignore : ignoreArr
        }) )
        .pipe( gulp.dest('build') );
});


gulp.task( 'default', ['s7queryMain','s7edit'] );
