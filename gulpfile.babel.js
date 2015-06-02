import gulp from 'gulp'

import autoprefixer from 'gulp-autoprefixer'
import babel from 'gulp-babel'
import babelify from 'babelify'
import browserify from 'browserify'
import cached from 'gulp-cached'
import concat from 'gulp-concat'
import del from 'del'
import childProcess from 'child_process'
const exec = childProcess.exec
import footer from 'gulp-footer'
import gulpif from 'gulp-if'
import gutil from 'gulp-util'
import livereload from 'gulp-livereload'
import minifyCSS from 'gulp-minify-css'
import minifyHTML from 'gulp-minify-html'
import ngAnnotate from 'gulp-ng-annotate'
import openBrowser from 'gulp-open'
import plumber from 'gulp-plumber'
import protractor from 'gulp-angular-protractor'
import rsync from 'gulp-rsync'
import runSequence from 'run-sequence'
import sass from 'gulp-sass'
import source from 'vinyl-source-stream'
import standard from 'gulp-standard'
import streamify from 'gulp-streamify'
import {server as superstatic} from 'superstatic'
import uglify from 'gulp-uglify'
import watchify from 'watchify'

import superstaticConf from './superstatic.json'

let conf = {
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
}

conf.browserEntryPoint = conf.browserRoot + 'index.html'
conf.scriptsPaths = [].concat.apply(['app/**/*.js'], conf.testsPaths)
conf.entryPath = conf.test ? conf.testEntryPath : conf.mainEntryPath

let inDev = !conf.production && !conf.staging
const distantHost = conf.production ? conf.productionHost : conf.stagingHost

gulp.task('default', ['scss', 'views', 'assets'], callback =>
  runSequence(
    'inject-livereload',
    'watch',
    'openBrowser',
    callback)
)

gulp.task('build', callback => {
  let tasks = ['scripts', 'scss', 'views', 'assets']

  if (conf.test) {
    tasks.push('build-tests')
  }

  return runSequence('clean', tasks, callback)
})

gulp.task('clean', () => del(conf.browserRoot))

gulp.task('pull', () =>
  exec('git pull npm install', (err, stdout, stderr) => {
    gutil.log(stdout)
    gutil.log(gutil.colors.red(stderr))

    if (err) {
      // do nothing
    }
  })
)

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
)

gulp.task('openBrowser', () =>
  gulp.src(conf.browserEntryPoint)
    .pipe(openBrowser('', {
      url: conf.localHost
    }))
)

gulp.task('inject-livereload', () =>
  gulp.src(conf.browserEntryPoint)
    .pipe(footer('<script src="http://127.0.0.1:35729/livereload.js?ext=Chrome"></script>'))
    .pipe(gulp.dest(conf.browserRoot))
)

gulp.task('standard', () =>
  gulp.src(conf.scriptsPaths)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      breakOnWarning: true
    }))
)

gulp.task('build-tests', () =>
  gulp.src(conf.testsPaths)
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(conf.es5testsRoot))
)

gulp.task('scripts', ['standard'], () => bundle(false))

gulp.task('scss', () =>
  gulp.src(['./node_modules/angular-material/angular-material.css', './scss/style.scss'])
    .pipe(gulpif(inDev, plumber()))
    .pipe(sass({sourceComments: !inDev ? false : 'map'}))
    .pipe(autoprefixer())
    .pipe(gulpif(!inDev, minifyCSS({keepSpecialComments: 0})))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(conf.browserRoot))
    .pipe(livereload())
)

gulp.task('views', () =>
  gulp.src(conf.viewsPaths)
    .pipe(cached('views'))
    .pipe(gulpif(!inDev, minifyHTML({
      empty: true,
      conditionals: true
    })))
    .pipe(gulp.dest(conf.browserRoot))
    .pipe(livereload())
)

gulp.task('assets', () =>
  gulp.src(conf.assetsPaths)
    .pipe(cached('assets'))
    .pipe(gulp.dest(conf.browserRoot))
    .pipe(livereload())
)

gulp.task('deploy', callback => {
  inDev = false

  return runSequence(
    'build',
    'rsync',
    callback)
})

gulp.task('watch', () => {
  gulp.watch(conf.scssPaths, ['scss'])
  gulp.watch(conf.viewsPaths, ['views'])
  gulp.watch(conf.assetsPaths, ['assets'])
  gulp.watch(conf.scriptsPaths, ['standard'])

  if (conf.test) {
    gulp.watch(conf.testsPaths, ['build-tests'])
  }

  bundle(true)

  return livereload.listen()
})

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
)

const bundle = watch => {
  let bundler = browserify(conf.entryPath, {
    cache: {},
    packageCache: {},
    insertGlobals: true,
    fullPaths: false,
    debug: inDev,
    noparse: ['angular', 'lodash']
  })

  if (watch) {
    bundler = watchify(bundler)
    bundler.on('update', () => rebundle(bundler))
  }

  return rebundle(bundler)
}

const rebundle = bundler =>
  bundler
    .transform(babelify)
    .bundle()
    .on('error', function (err) {
      gutil.log('Bundling error:', gutil.colors.red(err.toString()))
    })
    .pipe(source('bundle.js'))
    .pipe(ngAnnotate())
    .pipe(gulpif(!inDev, streamify(uglify())))
    .pipe(gulp.dest(conf.browserRoot))
    .pipe(livereload())