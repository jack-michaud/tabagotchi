'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const es6transpiler = require('gulp-es6-transpiler');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const jsSources = ['src/js/*.js'];
const jsOutputFile = 'script.js';
const jsOutputDir = 'dist/js';

// eslint
gulp.task('lint', () => {
  gulp.src(jsSources)
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    //.pipe(eslint.failOnError()); // fail on error for extra strictness
});

// minify and concat JS
gulp.task('js', () => {
  gulp.src(jsSources)
    // need to transpile first since uglify cannot handle ES6
    .pipe(es6transpiler())
    .pipe(uglify())
    .pipe(concat(jsOutputFile))
    .pipe(gulp.dest(jsOutputDir));
});

// watch
gulp.task('watch', () => {
  gulp.watch(jsSources, ['lint','js']);
});

// default task
gulp.task('default', ['lint', 'js', 'watch']);
