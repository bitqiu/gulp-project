'use strict';

var gulp = require('gulp');
var path = require('path');
var config = require('./config');
var _ = require('lodash');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'event-stream', 'main-bower-files', 'uglify-save-license', 'del']
});
var browserSync = require('browser-sync');
var gulpNgConfig = require('gulp-ng-config');

//配置环境任务
gulp.task('dev-config',function () {
  return gulp.src('app.conf.js')
        .pipe(gulpNgConfig('app',{
          environment: 'development',
          createModule: false,
          wrap: true
        }))
        .pipe(gulp.dest(path.join(config.paths.src,'/app')))
});
gulp.task('test-config',function () {
  return gulp.src('app.conf.js')
        .pipe(gulpNgConfig('app',{
          environment: 'test',
          createModule: false,
          wrap: true
        }))
        .pipe(gulp.dest(path.join(config.paths.src,'/app')))
});
gulp.task('prod-config',function () {
  return gulp.src('app.conf.js')
        .pipe(gulpNgConfig('app',{
          environment: 'production',
          createModule: false,
          wrap: true
        }))
        .pipe(gulp.dest(path.join(config.paths.src,'/app')))
});

// js代码检查
gulp.task('scripts',function () {
  return gulp.src(path.join(config.paths.src,'app/**/*.js'))
  .pipe($.jshint())
  .pipe($.jshint.reporter('jshint-stylish'))
  //js文件改变时无刷新加载
  .pipe(browserSync.reload({ stream: true }))
  .pipe($.size());
});

// 清理
gulp.task('clean', function () {
  $.del([path.join(config.paths.dist, '/'), path.join(config.paths.tmp, '/')]);
});

// 编译之前将 scss 注入 index.scss
gulp.task('inject_sass',function () {
  //1,将所有scss文件注入到index.scss
  var injectFiles = gulp.src([
      path.join(config.paths.src,'app/**/*.scss'),
      path.join('!'+ config.paths.src, 'app/index.scss')
    ],{read:false});
  /**
   * 参考API:https://github.com/klei/gulp-inject#optionsstarttag
   */
  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(config.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };
  return gulp.src(path.join(config.paths.src,'app/index.scss'))
          .pipe($.inject(injectFiles,injectOptions))
          .pipe(wiredep(_.assign({}, config.wiredep)))
          .pipe(gulp.dest(path.join(config.paths.src,'app/')))
});

// css sass 编译
gulp.task('styles:sass',['inject_sass'],function () {

  return gulp.src(path.join(config.paths.src,'app/index.scss'))
    .pipe($.plumber(config.errorHandler()))
    .pipe($.sourcemaps.init())
    .pipe($.sass({outputStyle: 'expanded'}))
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(config.paths.tmp,'/serve/app/')))
    //css改变时无刷新改变页面
    .pipe(browserSync.reload({ stream: true }));
});

// css compass 编译
gulp.task('styles:compass',['inject_sass'],function () {
  return gulp.src(path.join(config.paths.src,'app/index.scss'))
    .pipe($.plumber(config.errorHandler()))
    .pipe($.compass({
      config_file: path.join(__dirname, '/../config.rb'),
      css: path.join(config.paths.tmp, '/serve/app/'),
      sass: path.join(config.paths.src, '/app/'),
      //其余项都在config.rb中配置
    }))
    //sprite图片路径修复
    .pipe($.replace('../../../src/assets/images/', '../assets/images/'))
    .pipe(gulp.dest(path.join(config.paths.tmp,'/serve/app/')))
    //css改变时无刷新改变页面
    .pipe(browserSync.reload({ stream: true }));
});

// css,js 注入 html
// sass 编译和 compass 编译二选一
gulp.task('inject', ['scripts', 'styles:compass'], function () {
  var injectStyles = gulp.src([
    path.join(config.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + config.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(config.paths.src, '/app/**/*.module.js'),
    path.join(config.paths.src, '/app/**/*.js'),
    path.join('!' + config.paths.src, '/app/**/*.spec.js'),
    path.join('!' + config.paths.src, '/app/**/*.mock.js')
  ]).pipe($.angularFilesort());

  var injectOptions = {
    ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(config.paths.src, '/*.html'))
    .pipe($.plumber(config.errorHandler()))
    .pipe($.inject($.eventStream.merge(
      injectStyles,
      injectScripts
    ),injectOptions))
    .pipe(wiredep(_.extend({}, config.wiredep)))
    .pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));

});



