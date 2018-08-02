var gulp = require('gulp');

// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// Variables de chemins
var source = './src'; // dossier de travail
var destination = './dist'; // dossier à livrer




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




// Tâche "watch" = je surveille *less
gulp.task('watch', function () {
  gulp.watch(source + '/*.js', ['js']);
});

// Tâche "build"
gulp.task('build', ['clean', 'js']);

// Tâche "prod" = Build + minify
gulp.task('prod', ['build',  'minify']);

// Tâche par défaut
gulp.task('default', ['build', 'watch']);
