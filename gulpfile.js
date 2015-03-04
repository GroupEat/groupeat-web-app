var gulp = require('gulp'),
    argv = require('yargs').argv,
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulpif = require('gulp-if'),
    minifyCSS = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    plumber = require('gulp-plumber'),
    rsync = require('gulp-rsync'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    uglify = require('gulp-uglify');

var prodIP = '178.62.158.190';
var prod = argv.prod !== undefined;

gulp.task('deploy', function(callback) {
    prod = true;
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
            debug: !prod
        }))
        .pipe(ngAnnotate())
        .pipe(gulpif(prod, uglify()))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('sass', function () {
    return gulp.src(['./node_modules/angular-material/angular-material.css', './scss/style.scss'])
        .pipe(sass({sourceComments: prod ? false : 'map'}))
        .pipe(gulpif(prod, minifyCSS({keepSpecialComments: 0})))
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
            hostname: prodIP,
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

