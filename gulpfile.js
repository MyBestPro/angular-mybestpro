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
    exec       = require('exec'),
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
        var javascriptFiles = prependPath(config.source_dir, config.app_files.js);

        gutil.log(gutil.colors.yellow('Path patterns for TS and JS files'));
        dumpArray(javascriptFiles);

        return gulp.src(javascriptFiles)
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

gulp.task('js:build-dts',
    'Generates a single .d.ts bundle containing external module declarations exported from TypeScript module files.',
    [],
    function(callback) {
        exec([
            'dts-generator',
            '--name', 'angular-mybestpro',
            '--project', '.',
            '--exclude', 'dist/angular-mybestpro-d.ts',
            '--exclude', 'src/js/typings/tss.d.ts',
            '--exclude', 'src/js/typings/**/*.d.ts',
            '--exclude', 'node_modules/**/*.d.ts',
            '--out',
            'dist/angular-mybestpro.d.ts'
        ], function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            console.log(err);
            callback(err);
        });
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
gulp.task('default', 'Default tasks : "js:build", "js:build-dts" and then "watch"', ['js:build-dts', 'js:build'], function() {
    gulp.start('watch');
});

gulp.task('build', 'Build tasks : "js:build"  "js:build-dts"', ['js:build', 'js:build-dts']);

gulp.task('watch', 'Watch files modifications', [], function() {
    // JS
    var javascriptFiles = prependPath(config.source_dir, config.app_files.js);
    watch(javascriptFiles, function() {
        gulp.start('js:build');
        gulp.start('js:build-dts');
    });

    // CONFIG
    watch(['./config.js'], function() {
        gulp.start('config:reload');
    });

});
