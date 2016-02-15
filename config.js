/**
 * Configuration for build process
 */
module.exports = {
    /**
     * The `build_dir` folder is where the project is compiled
     * The `source_dir` folder is where the project is modified
     * The `ts_compile_dir` folder is where the typescripts are
     * compiled. Must be in the `app_files.js` folder.
     */
    "build_dir": "dist/",
    "source_dir": "src/",

    /**
     * Collection of file patterns that refers to the app code
     * used for the build task.
     */
    "app_files": {
        "js" : [
            "js/typings/**/*.ts",
            "js/ts/*.ts",
            "js/ts/lib/log.ts",
            "js/ts/lib/indexedDB.ts",
            "js/ts/lib/notificationPush.ts",
            "js/ts/controller/*.ts",
            "js/ts/component/*.ts"
        ],
        "fonts": ["font/**/*"],
        "images": ["img/**/*"],
        "html": ["html/**/*.html"],
        "index": ["index.html"]
    }
};