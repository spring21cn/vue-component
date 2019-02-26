// 引入 gulp
const gulp = require('gulp');
const connect = require('gulp-connect');
const clean = require('gulp-clean');


// 代码合并
const concat = require('gulp-concat');
const rename = require('gulp-rename');

// 代码压缩
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');

//配置文件
const cssPath = './static/css/';
const jsPath = './static/js/';

const cssList = [
  cssPath + 'normalize.css',
  cssPath + 'global.css',
  cssPath + 'components.css',
  cssPath + 'views.css'
]

const jsList = [
  jsPath + 'libs.js',
  jsPath + 'locale.js',
  jsPath + 'utils.js',
  jsPath + 'store.js',
  jsPath + 'components.js',
  jsPath + 'router.js',
  jsPath + 'directives.js',
]
const dist = './dist';

// ----------------↓TASKS-------------------------------------------

// 合并css文件任务
gulp.task('csss', function () {
    var stream =  gulp.src(cssList)
    .pipe(concat('viy-menu.css'))
    .pipe(gulp.dest(dist));
    return stream;
});

// 合并js文件任务
gulp.task('scripts', function () {
    return gulp.src(jsList)
        .pipe(concat('viy-menu.js'))
        .pipe(gulp.dest(dist));
});

gulp.task('compress', function () {
    gulp.src(dist + '/viy-menu.js')
        .pipe(uglify({
            mangle: true,
            compress: true
        }))
        .on('error', function (err) { console.log('[MINIFY ERROR!!!]', err.toString()); })
        .pipe(rename('viy-menu.min.js'))
        .pipe(gulp.dest(dist));

    gulp.src(dist + '/viy-menu.css')
        .pipe(cleanCSS())
        .pipe(rename('viy-menu.min.css'))
        .pipe(gulp.dest(dist));
});

gulp.task('clean', function (cb) {
    return gulp.src(dist, { read: false })
        .pipe(clean());
});

gulp.task('copyFont', function () {
    gulp.src(config.fontsSrcDir + '/*')
        .pipe(gulp.dest(config.distDir + '/fonts'))
});

gulp.task('default', function () {
    // 监听文件变化
    gulp.watch(jsPath + '*.js', ['scripts']);

    // 监听文件变化
    gulp.watch(cssPath + '*.css', ['csss']);

    connect.server({
        root: '.',
        port: 3000,
        livereload: false
    });
});

// 合并文件任务
gulp.task('merge', ['scripts', 'csss'], function () {
    return gulp.start('compress');
});

// 打包任务
gulp.task('build', function () {
    return gulp.start(['merge']);
});