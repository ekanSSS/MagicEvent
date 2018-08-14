const gulp = require('gulp');

// Include plugins
const plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// path var
const source = './src'; // work folder
const destination = './dist'; // distribuable folder


gulp.task('js', () => gulp.src(`${source}/*.js`)
  .pipe(plugins.concat('MagicEvent.js'))
  .pipe(plugins.babel({
    presets: ['env'],
  }))
  .pipe(plugins.uglify())
  .pipe(gulp.dest(destination)));

gulp.task('clean', () => gulp.src(destination, {read: false})
  .pipe(plugins.clean({force: true})));


gulp.task('watch', () => {
  gulp.watch(`${source}/*.js`, ['js']);
});

gulp.task('build', ['clean'],function(){ gulp.start('js') });

gulp.task('prod', ['build', 'minify']);

gulp.task('default', ['build', 'watch']);
