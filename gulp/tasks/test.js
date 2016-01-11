var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gulpSequence = require('gulp-sequence');
 
gulp.task('js-test', function () {
	return gulp.src('src/tests/**/*.js', {read: false})
			.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('test', gulpSequence('server','js-test'));