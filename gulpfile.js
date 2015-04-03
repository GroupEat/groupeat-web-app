var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var del = require('del');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var insert = require('gulp-insert');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var open = require('gulp-open');
var plumber = require('gulp-plumber');
var rsync = require('gulp-rsync');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');

var conf = {
    distPath: 'dist/',
    prodIP: '178.62.158.190',
    mainPath: 'dist/index.html',
    sassPaths: ['scss/**/*.scss'],
    viewsPaths: ['app/**/*.html'],
    assetsPaths: ['assets/**/*'],
    scriptsPaths: ['app/**/*.js'],
    localHost: 'http://groupeat.dev',
    prod: gutil.env.prod !== undefined
};

gulp.task('default', function(callback) {
    return runSequence(
        'build',
        'inject-livereload',
        'watch',
        'open',
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
    return runSequence(
        'clean',
        ['bundle', 'sass', 'views', 'assets'],
        callback);
});

gulp.task('clean', function() {
    return del('dist/');
});

gulp.task('clean-temp', function() {
    return del('temp/');
});

gulp.task('pull', shell.task([
    'git pull',
    'npm install'
]));

gulp.task('open', function() {
    return gulp.src(conf.mainPath)
        .pipe(open('', {
            url: conf.localHost
        }));
});

gulp.task('inject-livereload', function() {
    return gulp.src(conf.mainPath)
        .pipe(insert.append('<script src="http://127.0.0.1:35729/livereload.js?ext=Chrome"></script>'))
        .pipe(gulp.dest(conf.distPath));
});

gulp.task('jscs', function() {
    return gulp.src(conf.scriptsPaths)
        .pipe(jscs({esnext: true}));
});

gulp.task('lint', function() {
    return gulp.src(conf.scriptsPaths)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(gulpif(conf.prod, jshint.reporter('fail')));
});

gulp.task('babel', function() {
    return gulp.src('app/**/*.js')
        .pipe(gulpif(!conf.prod, plumber()))
        .pipe(babel())
        .pipe(gulp.dest('temp'));
});

gulp.task('browserify', function() {
    return gulp.src(['./temp/app.js'])
        .pipe(gulpif(!conf.prod, plumber()))
        .pipe(browserify({
            insertGlobals: true,
            debug: !conf.prod
        }))
        .pipe(ngAnnotate())
        .pipe(gulpif(conf.prod, uglify()))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(conf.distPath))
        .pipe(livereload());
});

gulp.task('bundle', ['jscs', 'lint'], function(callback) {
    return runSequence(
        'babel',
        'browserify',
        'clean-temp',
        callback);
});

gulp.task('sass', function() {
    return gulp.src(['./node_modules/angular-material/angular-material.css', './scss/style.scss'])
        .pipe(gulpif(!conf.prod, plumber()))
        .pipe(sass({sourceComments: conf.prod ? false : 'map'}))
        .pipe(autoprefixer())
        .pipe(gulpif(conf.prod, minifyCSS({keepSpecialComments: 0})))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(conf.distPath))
        .pipe(livereload());
});

gulp.task('views', function() {
    return gulp.src(conf.viewsPaths)
        .pipe(gulp.dest(conf.distPath))
        .pipe(livereload());
});

gulp.task('assets', function() {
    return gulp.src(conf.assetsPaths)
        .pipe(gulp.dest(conf.distPath))
        .pipe(livereload());
});

gulp.task('deploy', function(callback) {
    conf.prod = true;

    return runSequence(
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
