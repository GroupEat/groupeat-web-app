var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    livereload = require('gulp-livereload'),
    minifyCSS = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    rsync = require('gulp-rsync'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
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

gulp.task('bundle', function() {
    return gulp.src(['./app/app.js'])
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
