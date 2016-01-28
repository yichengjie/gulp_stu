var gulp = require('gulp');
var concat = require('gulp-concat');                            //- 多个文件合并为一个；
var minifyCss = require('gulp-minify-css');                     //- 压缩CSS为一行；
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');               //- 路径替换

gulp.task('concat', function() {                                //- 创建一个名为 concat 的 task
    gulp.src(['./css/wap_v3.1.css', './css/wap_v3.1.3.css'])    //- 需要处理的css文件，放到一个字符串数组里
        .pipe(concat('wap.min.css'))                            //- 合并后的文件名
        .pipe(minifyCss())                                      //- 压缩处理成一行
        .pipe(rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest('./css'))                               //- 输出文件本地
        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('rev', function() {
    gulp.src(['./rev/*.json', './application/**/header.php'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./application/'));                     //- 替换后的文件输出的目录
});

gulp.task('default', ['concat', 'rev']);




/*var gulp = require('gulp'),
    cssmin = require('gulp-minify-css');
    //确保已本地安装gulp-make-css-url-version [cnpm install gulp-make-css-url-version --save-dev]
    cssver = require('gulp-make-css-url-version'); 
 
gulp.task('testCssmin', function () {
    gulp.src('src/css/index.css')
        .pipe(cssver()) //给css文件里引用文件加版本号（文件MD5）
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});

gulp.task("default", ['testCssmin']) ;*/