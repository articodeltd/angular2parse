const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const webpack = require('webpack');
const ngc = require('gulp-ngc');
const jsonTransform = require('gulp-json-transform');
const clean = require('gulp-clean');

gulp.task('ngc', () => {
    return ngc('./tsconfig-aot.json');
});

gulp.task('es5', ['ngc'], () => {
    return gulp.src(["./release/**/*.js", "!node_modules/**/*.*"])
        .pipe(babel())
        .pipe(gulp.dest('./release'));
});

gulp.task('package-json', function() {
    gulp.src('./package.json')
        .pipe(jsonTransform(function(data, file) {
            delete data.devDependencies;

            if (data.scripts) {
                delete data.scripts.build;
                delete data.scripts.publish;
            }

            data.main = 'index.js';

            return data;
        }))
        .pipe(gulp.dest('./release'));
});

gulp.task('readme', () => {
    return gulp.src(["./README.md"])
        .pipe(gulp.dest('./release'));
});

gulp.task('clean', function () {
    return gulp.src('./release', {read: false})
        .pipe(clean());
});

gulp.task('build', ['clean', 'es5', 'package-json', 'readme']);


