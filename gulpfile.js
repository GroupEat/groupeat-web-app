var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
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
var protractor = require('gulp-angular-protractor');
var rsync = require('gulp-rsync');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var superstatic = require('superstatic').server;
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var conf = {
    browserRoot: 'dist/',
    mainEntryPath: './app/app.js',
    testEntryPath: './app/app.test.js',
    scssPaths: ['scss/**/*.scss'],
    viewsPaths: ['app/**/*.html'],
    assetsPaths: ['assets/**/*'],
    testsPaths: ['tests/**/*.js'],
    es5testsRoot: 'dist-tests/',
    localHost: 'http://groupeat.dev',
    productionHost: 'groupeat.fr',
    stagingHost: 'staging.groupeat.fr',
    production: gutil.env.production !== undefined,
    staging: gutil.env.staging !== undefined,
    test: gutil.env.test !== undefined
};

conf.browserEntryPoint = conf.browserRoot + 'index.html';
conf.scriptsPaths = [].concat.apply(['app/**/*.js'], conf.testsPaths);
conf.entryPath = conf.test ? conf.testEntryPath : conf.mainEntryPath;
var superstaticConf = require('./superstatic.json');

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
    var tasks = ['scripts', 'scss', 'views', 'assets'];

    if (conf.test) {
        tasks.push('build-tests');
    }

    return runSequence('clean', tasks, callback);
});

gulp.task('clean', function() {
    return del(conf.browserRoot);
});

gulp.task('pull', function() {
    return exec('git pull; npm install', function (err, stdout, stderr) {
        gutil.log(stdout);
        gutil.log(gutil.colors.red(stderr));
    });
});

gulp.task('test', function() {
    superstatic(superstaticConf).listen(function() {
        return gulp.src([])
            .pipe(protractor({
                debug: true,
                autoStartStopServer: true,
                configFile: './protractor.conf.js'
            }))
            .on('error', function(e) {
                console.log(e);
            });
    });
});

gulp.task('openBrowser', function() {
    return gulp.src(conf.browserEntryPoint)
        .pipe(openBrowser('', {
            url: conf.localHost
        }));
});

gulp.task('inject-livereload', function() {
    return gulp.src(conf.browserEntryPoint)
        .pipe(footer('<script src="http://127.0.0.1:35729/livereload.js?ext=Chrome"></script>'))
        .pipe(gulp.dest(conf.browserRoot));
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

gulp.task('build-tests', function() {
    return gulp.src(conf.testsPaths)
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest(conf.es5testsRoot));
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
        .pipe(gulp.dest(conf.browserRoot))
        .pipe(livereload());
});

gulp.task('views', function() {
    return gulp.src(conf.viewsPaths)
        .pipe(cached('views'))
        .pipe(gulpif(!inDev, minifyHTML({
            empty: true,
            conditionals: true
        })))
        .pipe(gulp.dest(conf.browserRoot))
        .pipe(livereload());
});

gulp.task('assets', function() {
    return gulp.src(conf.assetsPaths)
        .pipe(cached('assets'))
        .pipe(gulp.dest(conf.browserRoot))
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

    if (conf.test) {
        gulp.watch(conf.testsPaths, ['build-tests']);
    }

    bundle(true);

    return livereload.listen();
});

gulp.task('rsync', function() {
    return gulp.src(conf.browserRoot)
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
        fullPaths: false,
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
        .pipe(ngAnnotate())
        .pipe(gulpif(!inDev, streamify(uglify())))
        .pipe(gulp.dest(conf.browserRoot))
        .pipe(livereload());
}
