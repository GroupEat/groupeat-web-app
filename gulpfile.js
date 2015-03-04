var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    del = require('del'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

gulp.task('build', ['bundle', 'sass', 'views', 'assets']);

gulp.task('clean', function() {
    del('dist/');
});

gulp.task('bundle', function() {
    gulp.src(['./app/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('sass', function () {
    gulp.src(['./node_modules/angular-material/angular-material.css', './scss/style.scss'])
        .pipe(sass({sourceComments: 'map'}))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('views', function() {
    gulp.src('./app/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('assets', function() {
    gulp.src('./assets/**/*')
        .pipe(gulp.dest('dist/'));
});

