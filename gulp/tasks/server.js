var gulp = require('gulp');
var nodemon = require('gulp-nodemon')

gulp.task('server', function () {
  nodemon({
    script: 'src/server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  });
});