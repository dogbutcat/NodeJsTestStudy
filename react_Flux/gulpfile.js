/**
 * Created by oliver on 7/18/16.
 */
"use strict";
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    react = require('gulp-react'),
    browserify = require('gulp-browserify'),
    jade = require('gulp-jade');

var path = {
    JadeFile:'./*.jade',
    TemplateDest:'./dist/',
    HtmlDest:'./dist/*.html',
    JsDest:'./dist/js',
    JsDestFile:'./dist/js/**/*.js',
    JSX:'./components/**/*.jsx',
    JSComponentDest:'./dist/js/component',
    ComponentName:'Component.js',
    JSAction:'./actions/*.js',
    JSActionDest:'./dist/js/actions',
    JSDispatcher:'./dispatcher/*.js',
    JSDispatcherDest:'./dist/js/dispatcher',
    JSStore:'./stores/*.js',
    JSStoreDest:'./dist/js/stores',
    IndexJSX:'./*.jsx'
};

gulp.task('template',function () {
    gulp.src(path.JadeFile)
        .pipe(jade({pretty:true}))
        .pipe(gulp.dest(path.TemplateDest))
        .pipe(connect.reload());
});

gulp.task('index',function () {
    gulp.src(path.IndexJSX)
        .pipe(browserify({
            transform:'reactify'
        }))
        .pipe(react())
        .pipe(gulp.dest(path.JsDest));
});

gulp.task('jsCompile',function () {
    gulp.src(path.JSX)
        .pipe(react())
        .pipe(concat(path.ComponentName))
        .pipe(gulp.dest(path.JSComponentDest));
});

gulp.task('jsAction',function () {
    ConcatJs(path.JSAction,path.JSActionDest,'actions.js')
});

gulp.task('jsDispatcher',function () {
    ConcatJs(path.JSDispatcher,path.JSDispatcherDest,'dispatcher.js')
});

gulp.task('jsStore',function () {
    ConcatJs(path.JSStore,path.JSStoreDest,'store.js')
});

gulp.task('connect',function () {
    connect.server({
        root:'./',
        port:5000,
        livereload:true
    })
});

gulp.task('js',function () {
    gulp.src(path.JsDestFile)
        .pipe(connect.reload());
});

gulp.task('watchJs',function () {
    gulp.watch(path.JsDestFile,['js']);
    gulp.watch(path.JSX,['jsCompile']);
    gulp.watch(path.IndexJSX,['index']);
    gulp.watch(path.JSAction,['jsAction']);
    gulp.watch(path.JSDispatcher,['jsDispatcher']);
    gulp.watch(path.JSStore,['jsStore']);
});

gulp.task('watchTemplate',function () {
    // gulp.watch(path.HtmlDest,['template']);
    gulp.watch(path.JadeFile,['template']);
});

function ConcatJs(fileSrc, fileDest, fileName) {
    return gulp.src(fileSrc)
        .pipe(concat(fileName))
        .pipe(gulp.dest(fileDest))
        .pipe(connect.reload());
}

gulp.task('watch',['watchJs','watchTemplate']);

gulp.task('default',['jsAction','jsDispatcher','jsStore','jsCompile','template','index']);
gulp.task('server',['template','jsAction','jsDispatcher','jsStore','index','jsCompile','watch','connect']);