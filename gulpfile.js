var gulp = require('gulp');

// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// path var
var source = './src'; // work folder
var destination = './dist'; // distribuable folder




gulp.task('js', () =>
    gulp.src(source + '/*.js')
        .pipe(plugins.concat("EventHandler.js"))
        .pipe(plugins.babel({
            "presets": ["env"]
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(destination))
);

gulp.task('clean', () => 
  gulp.src(destination)
    .pipe(plugins.clean({force: true}))
)




gulp.task('watch', function () {
  gulp.watch(source + '/*.js', ['js']);
});

gulp.task('build', ['clean', 'js']);

gulp.task('prod', ['build',  'minify']);

gulp.task('default', ['build', 'watch']);
