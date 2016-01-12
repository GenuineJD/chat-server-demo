var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gulpSequence = require('gulp-sequence');
 
gulp.task('js-test', function () {
	console.log('running js tests...');
	return gulp.src('src/tests/**/*.js', {read: false})
			.pipe(mocha({reporter: 'nyan'}))
			.once('error', function() {
				process.exit(1);
			})
			.once('end', function() {
				process.exit();
			});
});

gulp.task('test', gulpSequence('server','js-test'));