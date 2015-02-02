var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('jshint', function () {
    return gulp.src([ 'site/site.js', 'site/lib/**/*' ])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});
