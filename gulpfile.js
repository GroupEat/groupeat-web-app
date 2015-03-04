var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

gulp.task('bundle', function() {
    gulp.src(['./app/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('sass', function () {
    gulp.src(['./node_modules/angular-material/angular-material.css', './assets/scss/style.scss'])
        .pipe(sass({sourceComments: 'map'}))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('.'));
});

