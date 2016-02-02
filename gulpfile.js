/**
 * Gulp main file
 * Usage : gulp [task]
 * Task API : gulp.task(name[, helpMessage, deps, fn, taskOptions])
 * More at https://www.npmjs.com/package/gulp-help
 */
var gulp = require('gulp-help')(require('gulp'));

/**
 * Load all dependencies
 */
var gutil      = require('gulp-util'),
    watch      = require('gulp-watch'),
    del        = require('del'),
    rename     = require('gulp-rename'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify'),
    gulpIf     = require('gulp-if'),
    ts         = require('gulp-typescript'),
    tsProject  = ts.createProject('tsconfig.json');

/**
 * Helper to build paths
 */
function prependPath(prependValue, array) {
    return array.map(function(value) {
        return prependValue + value;
    });
}

/**
 * Helper to dump array
 */
function dumpArray(array) {
    console.log('[');
    array.forEach(function(value){
        console.log('    ' + value);
    });
    console.log(']');
}


/**
 * Load configuration
 */
var config = require('./config.js');

/**
 * Reload config file (for watch)
 */
gulp.task('config:reload', 'Reload configuration for watchers', [], function() {
    config = require('./config.js');
});

/**
 * Build JS files
 * @launch js:remove
 */
gulp.task('js:build',
    'Build main JS file (call "js:remove")',
    ['js:remove'],
    function () {
        var typescriptFiles = prependPath(config.source_dir, config.app_files.ts.concat(config.app_files.typings)),
            javascriptFiles = prependPath(config.source_dir, config.app_files.js),
            allFiles = typescriptFiles.concat(javascriptFiles);

        gutil.log(gutil.colors.yellow('Path patterns for TS and JS files'));
        dumpArray(allFiles);

        return gulp.src(allFiles)
            .pipe(sourcemaps.init())
            .pipe(gulpIf('*.ts', ts(tsProject)))
            .pipe(concat('angular-mybestpro.js'))
            .pipe(gulp.dest(config.build_dir + 'js/'))
            .pipe(rename('angular-mybestpro.min.js'))
            .pipe(uglify({ preserveComments: 'licence' }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.build_dir + 'js/'));
    }
);

/**
 * Remove JS files built
 */
gulp.task('js:remove',
    'Remove main JS file built',
    function (callback) {
        return del([
            config.build_dir + 'js/**/*'
        ], callback);
    }
);

/**
 * Task launched by default
 */
gulp.task('default', 'Default tasks : "js:build" and then "watch"', ['js:build'], function() {
    gulp.start('watch');
});

gulp.task('build', 'Build tasks :  "js:build"', ['js:build']);

gulp.task('watch', 'Watch files modifications', [], function() {
    // HTML
    var indexFile = prependPath(config.source_dir, config.app_files.index),
        tplFiles  = prependPath(config.source_dir, config.app_files.html),
        allHtmlFiles  = indexFile.concat(tplFiles);

    watch(allHtmlFiles, function() {
        gulp.start('html:build');
    });

    // JS
    var typescriptFiles = prependPath(config.source_dir, config.app_files.ts.concat(config.app_files.typings)),
        javascriptFiles = prependPath(config.source_dir, config.app_files.js),
        allJsFiles = typescriptFiles.concat(javascriptFiles);

    watch(allJsFiles, function() {
        gulp.start('js:build');
    });

    // CONFIG
    watch(['./config.js'], function() {
        gulp.start('config:reload');
    });

});