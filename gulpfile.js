var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    minifyCSS = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    plumber = require('gulp-plumber'),
    rsync = require('gulp-rsync'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify');

var conf = {
    prodIP: '178.62.158.190',
    sassPaths: ['scss/**/*.scss'],
    viewsPaths: ['app/**/*.html'],
    assetsPaths: ['assets/**/*'],
    scriptsPaths: ['app/**/*.js'],
    prod: gutil.env.prod != undefined
}

gulp.task('default', function(callback) {
    runSequence(
        'build',
        'watch',
        callback);
});

gulp.task('watch', function() {
    gulp.watch(conf.sassPaths, ['sass']);
    gulp.watch(conf.viewsPaths, ['views']);
    gulp.watch(conf.assetsPaths, ['assets']);
    gulp.watch(conf.scriptsPaths, ['bundle']);
    return livereload.listen();
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

gulp.task('jscs', function() {
    return gulp.src(conf.scriptsPaths)
        .pipe(jscs()); // TODO: set 'requireCamelCaseOrUpperCaseIdentifiers' to true when error_key has changed to errorKey
});

gulp.task('lint', function() {
    return gulp.src(conf.scriptsPaths)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(gulpif(conf.prod, jshint.reporter('fail')));
});

gulp.task('bundle', ['jscs', 'lint'], function() {
    return gulp.src(['./app/app.js'])
        .pipe(plumber())
        .pipe(browserify({
            insertGlobals: true,
            debug: !conf.prod
        }))
        .pipe(ngAnnotate())
        .pipe(gulpif(conf.prod, uglify()))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src(['./node_modules/angular-material/angular-material.css', './scss/style.scss'])
        .pipe(plumber())
        .pipe(sass({sourceComments: conf.prod ? false : 'map'}))
        .pipe(gulpif(conf.prod, minifyCSS({keepSpecialComments: 0})))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});

gulp.task('views', function() {
    return gulp.src(conf.viewsPaths)
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});

gulp.task('assets', function() {
    return gulp.src(conf.assetsPaths)
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});

gulp.task('deploy', function(callback) {
    conf.prod = true;
    runSequence(
        'build',
        'rsync',
        callback);
});

gulp.task('rsync', function() {
    return gulp.src('./dist/')
        .pipe(rsync({
            destination: '~/frontend',
            root: '.',
            hostname: conf.prodIP,
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
