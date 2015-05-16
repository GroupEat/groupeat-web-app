var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var babelify = require('babelify');
var browserify = require('browserify');
var cached = require('gulp-cached');
var concat = require('gulp-concat');
var del = require('del');
var exec = require('child_process').exec;
var footer = require('gulp-footer');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var openBrowser = require('gulp-open');
var plumber = require('gulp-plumber');
var rsync = require('gulp-rsync');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var conf = {
    distPath: 'dist/',
    entryPath: './app/app.js',
    mainPath: 'dist/index.html',
    scssPaths: ['scss/**/*.scss'],
    viewsPaths: ['app/**/*.html'],
    assetsPaths: ['assets/**/*'],
    scriptsPaths: ['app/**/*.js'],
    localHost: 'http://groupeat.dev',
    productionHost: 'groupeat.fr',
    stagingHost: 'staging.groupeat.fr',
    production: gutil.env.production !== undefined,
    staging: gutil.env.staging !== undefined
};

var inDev = !conf.production && !conf.staging;

if (!inDev) {
    var distantHost = conf.production ? conf.productionHost : conf.stagingHost;
}

gulp.task('default', ['scss', 'views', 'assets'], function(callback) {
    return runSequence(
        'inject-livereload',
        'watch',
        'openBrowser',
        callback);
});

gulp.task('build', function(callback) {
    return runSequence(
        'clean',
        ['scripts', 'scss', 'views', 'assets'],
        callback);
});

gulp.task('clean', function() {
    return del(conf.distPath);
});

gulp.task('pull', function() {
    return exec('git pull; npm install', function (err, stdout, stderr) {
        gutil.log(stdout);
        gutil.log(gutil.colors.red(stderr));
    });
});

gulp.task('openBrowser', function() {
    return gulp.src(conf.mainPath)
        .pipe(openBrowser('', {
            url: conf.localHost
        }));
});

gulp.task('inject-livereload', function() {
    return gulp.src(conf.mainPath)
        .pipe(footer('<script src="http://127.0.0.1:35729/livereload.js?ext=Chrome"></script>'))
        .pipe(gulp.dest(conf.distPath));
});

gulp.task('jscs', function() {
    return gulp.src(conf.scriptsPaths)
        .pipe(cached('jscs'))
        .pipe(jscs({esnext: true}));
});

gulp.task('jshint', function() {
    return gulp.src(conf.scriptsPaths)
        .pipe(cached('jshint'))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(gulpif(!inDev, jshint.reporter('fail')));
});

gulp.task('scripts', ['jscs', 'jshint'], function() {
    return bundle(false);
});

gulp.task('scss', function() {
    return gulp.src(['./node_modules/angular-material/angular-material.css', './scss/style.scss'])
        .pipe(gulpif(inDev, plumber()))
        .pipe(sass({sourceComments: !inDev ? false : 'map'}))
        .pipe(autoprefixer())
        .pipe(gulpif(!inDev, minifyCSS({keepSpecialComments: 0})))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(conf.distPath))
        .pipe(livereload());
});

gulp.task('views', function() {
    return gulp.src(conf.viewsPaths)
        .pipe(cached('views'))
        .pipe(gulpif(!inDev, minifyHTML({
            empty: true,
            conditionals: true
        })))
        .pipe(gulp.dest(conf.distPath))
        .pipe(livereload());
});

gulp.task('assets', function() {
    return gulp.src(conf.assetsPaths)
        .pipe(cached('assets'))
        .pipe(gulp.dest(conf.distPath))
        .pipe(livereload());
});

gulp.task('deploy', function(callback) {
    inDev = false;

    return runSequence(
        'build',
        'rsync',
        callback);
});

gulp.task('watch', function() {
    gulp.watch(conf.scssPaths, ['scss']);
    gulp.watch(conf.viewsPaths, ['views']);
    gulp.watch(conf.assetsPaths, ['assets']);
    gulp.watch(conf.scriptsPaths, ['jscs', 'jshint']);

    bundle(true);

    return livereload.listen();
});

gulp.task('rsync', function() {
    return gulp.src(conf.distPath)
        .pipe(rsync({
            destination: '~/frontend',
            root: '.',
            hostname: distantHost,
            username: 'vagrant',
            incremental: true,
            progress: true,
            relative: true,
            emptyDirectories: true,
            recursive: true,
            clean: true,
            silent: true,
            exclude: ['.DS_Store'],
            include: []
        }));
});

function bundle(watch) {
    var bundler = browserify(conf.entryPath, {
        cache: {},
        packageCache: {},
        insertGlobals: true,
        fullPaths: true,
        debug: inDev,
        noparse: ['angular', 'lodash']
    });

    if (watch) {
        bundler = watchify(bundler);
        bundler.on('update', function() {
            return rebundle(bundler);
        });
    }

    return rebundle(bundler);
}

function rebundle(bundler) {
    return bundler
        .transform(babelify)
        .bundle()
        .on('error', function(err) {
            gutil.log('Bundling error:', gutil.colors.red(err.toString()));
        })
        .pipe(source('bundle.js'))
        .pipe(gulpif(!inDev, replace(__dirname, '.')))
        .pipe(ngAnnotate())
        .pipe(gulpif(!inDev, streamify(uglify())))
        .pipe(gulp.dest(conf.distPath))
        .pipe(livereload());
}
