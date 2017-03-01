const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack');
const ngc = require('gulp-ngc');
const jsonTransform = require('gulp-json-transform');
const clean = require('gulp-clean');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup');
const sourcemaps = require('rollup-plugin-sourcemaps');

gulp.task('ngc', () => {
    return ngc('tsconfig.esm.json');
});

gulp.task('bundle', ['ngc'], done => rollup
    .rollup({
        entry: 'release/index.js',
        sourceMap: true,
        plugins: [
            nodeResolve({jsnext: true, main: true}),
            commonjs({
                include: 'node_modules/**',
            }),
            sourcemaps()
        ],
        external: [
            '@angular/core',
        ]
    })
    .then(bundle => bundle.write({
        format: 'umd',
        moduleName: 'ng.parse',
        dest: 'release/bundles/angular2parse.umd.js',
        globals: {
            '@angular/core': 'ng.core',
        },
    })));

gulp.task('package-json', function() {
    gulp.src('./package.json')
        .pipe(jsonTransform(function(data, file) {
            delete data.devDependencies;

            if (data.scripts) {
                delete data.scripts.build;
                delete data.scripts.publish;
            }

            data.main = 'bundles/angular2parse.umd.js';

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

gulp.task('build', ['clean', 'bundle', 'package-json', 'readme']);


