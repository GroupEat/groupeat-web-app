var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    del = require('del'),
    rsync = require('gulp-rsync'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

gulp.task('deploy', function(callback) {
    runSequence(
        'build',
        'rsync',
        callback);
});

gulp.task('build', function(callback) {
    runSequence(
        'clean',
        ['bundle', 'sass', 'views', 'assets'],
        callback);
});

gulp.task('clean', function() {
    return del('dist/');
});

gulp.task('bundle', function() {
    return gulp.src(['./app/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('sass', function () {
    return gulp.src(['./node_modules/angular-material/angular-material.css', './scss/style.scss'])
        .pipe(sass({sourceComments: 'map'}))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('views', function() {
    return gulp.src('./app/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('assets', function() {
    return gulp.src('./assets/**/*')
        .pipe(gulp.dest('dist/'));
});

gulp.task('rsync', function() {
    return gulp.src('./dist/')
        .pipe(rsync({
            destination: '~/frontend',
            root: '.',
            hostname: '178.62.158.190',
            username: 'vagrant',
            incremental: true,
            progress: true,
            relative: true,
            emptyDirectories: true,
            recursive: true,
            clean: true,
            exclude: ['.DS_Store'],
            include: []
        }));
});

