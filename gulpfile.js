var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass-embedded'));
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var mode = require('gulp-mode')(["production", "development"]);
var cleanSweep = require("clean-sweep");
var cleanDest = 'css';

function clean(done) {
  try {
    cleanSweep.sweepSync(cleanDest, {
      verbose: true,
      threshHold: 9999999
    });
  } catch (err) {
    console.error(err.message);
  }
  done();
}
function compileCss(done) {
  const postCssPlugins = [
    autoprefixer()
  ].filter(Boolean);
  // Define a task to compile main SCSS
  gulp.src('scss/style.scss')
    .pipe((mode.development(sourcemaps.init())))
    .pipe(mode.development(sass({api: "modern-compiler"}).on('error', sass.logError))) 
    .pipe(mode.production(sass({outputStyle: "compressed"}).on('error', sass.logError))) 
    .pipe(postcss(postCssPlugins))
    .pipe((mode.development(sourcemaps.write())))
    .pipe(gulp.dest('css'));
  // Define a task to compile Custom standaone SCSS
  gulp.src('scss/custom/*.scss')
    .pipe(mode.development(sourcemaps.init()))
    .pipe(mode.development(sass().on('error', sass.logError)))
    .pipe(mode.production(sass({outputStyle: "compressed"}).on('error', sass.logError)))
    .pipe(postcss(postCssPlugins))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(gulp.dest('css/custom'));
  done();
} 

gulp.task('watcher', function() {
  gulp.watch('scss/**/*.scss', compileCss);  
});

gulp.task('watch', gulp.series(clean, compileCss, 'watcher'));
gulp.task('build', gulp.series(clean, compileCss));
