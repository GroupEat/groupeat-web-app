const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('browserify');
const cached = require('gulp-cached');
const concat = require('gulp-concat');
const del = require('del');
const exec = require('child_process').exec;
const eslint = require('gulp-eslint');
const footer = require('gulp-footer');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const minifyCSS = require('gulp-minify-css');
const minifyHTML = require('gulp-minify-html');
const ngAnnotate = require('gulp-ng-annotate');
const openBrowser = require('gulp-open');
const plumber = require('gulp-plumber');
const protractor = require('gulp-angular-protractor');
const rsync = require('gulp-rsync');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const superstatic = require('superstatic').server;
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const superstaticConf = require('./superstatic.json');

var conf = {
  browserRoot: 'dist/',
  mainEntryPath: './src/app/app.js',
  testEntryPath: './src/app/app.test.js',
  scssPaths: [
    './node_modules/angular-loading-bar/build/loading-bar.css',
    './node_modules/angular-material/angular-material.css',
    './node_modules/material-design-icons-iconfont/dist/material-design-icons.css',
    './src/scss/style.scss'
  ],
  viewsPaths: ['src/app/**/*.html'],
  assetsPaths: ['src/assets/**/*'],
  fontsPaths: [
    './node_modules/material-design-icons-iconfont/dist/fonts/*'
  ],
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
conf.scriptsPaths = [].concat.apply(['src/app/**/*.js'], conf.testsPaths);
conf.entryPath = conf.test ? conf.testEntryPath : conf.mainEntryPath;

var inDev = !(conf.test || conf.production || conf.staging);
const distantHost = conf.production ? conf.productionHost : conf.stagingHost;

const rebundle = bundler =>
  bundler
    .transform(babelify)
    .bundle()
    .on('error', err => gutil.log('Bundling error:', gutil.colors.red(err.toString())))
    .pipe(source('bundle.js'))
    .pipe(ngAnnotate())
    .pipe(gulpif(!inDev, streamify(uglify({
      mangle: false
    })))) // TODO understand why mangle breaks the dashboard
    .pipe(gulp.dest(conf.browserRoot))
    .pipe(livereload());

const bundle = watch => {
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
    bundler.on('update', () => rebundle(bundler));
  }

  return rebundle(bundler);
};

gulp.task('default', ['scss', 'views', 'assets'], callback =>
  runSequence(
    'fonts',
    'inject-livereload',
    'watch',
    'openBrowser',
    callback)
);

gulp.task('build', callback => {
  var tasks = ['scripts', 'scss', 'views', 'assets'];

  if (conf.test) {
    tasks.push('build-tests');
  }

  return runSequence('clean', tasks, 'fonts', callback);
});

gulp.task('clean', () => del(conf.browserRoot));

gulp.task('pull', () =>
  exec('git pull npm install', (err, stdout, stderr) => {
    gutil.log(stdout);
    gutil.log(gutil.colors.red(stderr));
  })
);

gulp.task('test', () =>
  superstatic(superstaticConf).listen(() =>
    gulp.src([])
      .pipe(protractor({
        debug: true,
        autoStartStopServer: true,
        configFile: './protractor.conf.js'
      }))
      .on('error', e => console.log(e))
  )
);

gulp.task('openBrowser', () =>
  gulp.src(conf.browserEntryPoint)
    .pipe(openBrowser('', {
      url: conf.localHost
    }))
);

gulp.task('inject-livereload', () =>
  gulp.src(conf.browserEntryPoint)
    .pipe(footer('<script src="http://127.0.0.1:35729/livereload.js?ext=Chrome"></script>'))
    .pipe(gulp.dest(conf.browserRoot))
);

gulp.task('eslint', () =>
  gulp.src(conf.scriptsPaths)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
);

gulp.task('build-tests', () =>
  gulp.src(conf.testsPaths)
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(conf.es5testsRoot))
);

gulp.task('scripts', () => bundle(false));

gulp.task('scss', () =>
  gulp.src(conf.scssPaths)
    .pipe(gulpif(inDev, plumber(function(error) {
      gutil.log(gutil.colors.red(error.message));
      this.emit('end');
    })))
    .pipe(sass({sourceComments: !inDev ? false : 'map'}))
    .pipe(autoprefixer())
    .pipe(gulpif(!inDev, minifyCSS({keepSpecialComments: 0})))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(conf.browserRoot))
    .pipe(livereload())
);

gulp.task('views', () =>
  gulp.src(conf.viewsPaths)
    .pipe(cached('views'))
    .pipe(gulpif(!inDev, minifyHTML({
      empty: true,
      conditionals: true
    })))
    .pipe(gulp.dest(conf.browserRoot))
    .pipe(livereload())
);

gulp.task('assets', () =>
  gulp.src(conf.assetsPaths)
    .pipe(cached('assets'))
    .pipe(gulp.dest(conf.browserRoot))
    .pipe(livereload())
);

gulp.task('fonts', () =>
  gulp.src(conf.fontsPaths)
    .pipe(gulp.dest(conf.browserRoot + '/fonts'))
);

gulp.task('deploy', callback => {
  inDev = false;

  return runSequence(
    'build',
    'rsync',
    callback);
});

gulp.task('watch', () => {
  gulp.watch(['src/scss/**/*.scss'], ['scss']);
  gulp.watch(conf.viewsPaths, ['views']);
  gulp.watch(conf.assetsPaths, ['assets']);

  if (conf.test) {
    gulp.watch(conf.testsPaths, ['build-tests']);
  }

  bundle(true);

  return livereload.listen();
});

gulp.task('rsync', () =>
  gulp.src(conf.browserRoot)
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
    }))
);
