var transport = require("gulp-seajs-transport");
var gulp = require("gulp");

gulp.task("default",function(){
  gulp.src("./app/edit/app.js")
        .pipe(transport())
        .pipe(gulp.dest("./dist"));
})
