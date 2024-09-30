const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass-embedded'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cleancss = require('gulp-cleaner-css');
const mode = require('gulp-mode')();

function compileCss(done) {
  const postCssPlugins = [
    autoprefixer()
  ].filter(Boolean);
  // Define a task to compile main SCSS
  gulp.src('scss/style.scss')
    .pipe((mode.development(sourcemaps.init())))
    .pipe(sass({api: "modern"}).on('error', sass.logError)) 
    .pipe(postcss(postCssPlugins))
    .pipe((mode.production(cleancss())))
    .pipe((mode.development(sourcemaps.write())))
    .pipe(gulp.dest('css'));
  // Define a task to compile Custom standaone SCSS
  gulp.src('scss/custom/*.scss')
    .pipe((mode.development(sourcemaps.init())))
    .pipe(sass({api: "modern"}).on('error', sass.logError))
    .pipe(postcss(postCssPlugins))
    .pipe((mode.production(cleancss())))
    .pipe((mode.development(sourcemaps.write())))
    .pipe(gulp.dest('css/custom'));
  done();
} 

gulp.task('watcher', function() {
  gulp.watch('scss/**/*.scss', compileCss);  
});

gulp.task('watch', gulp.series(compileCss, 'watcher'));
gulp.task('build', compileCss);
