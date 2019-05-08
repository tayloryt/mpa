const gulp = require("gulp");
const watch = require("gulp-watch");
const babel = require("gulp-babel");
const rollup = require('gulp-rollup');
const replace = require('rollup-plugin-replace');
const gulpSequence = require('gulp-sequence')

//开发环境的gulp
gulp.task("builddev", () => {
    return watch("src/nodeuii/**/*.js", {
        ignoreInitial: false
    }, () => {
        gulp.src("src/nodeuii/**/*.js")
            .pipe(babel({
                babelrc: false,
                "plugins": [
                    ["@babel/plugin-proposal-decorators", {
                        "legacy": true
                    }], "transform-es2015-modules-commonjs"
                ]
            }))
            .pipe(gulp.dest('dist'))
    })
});
//上线环境的gulp
gulp.task("buildprod", () => {
    gulp.src("src/nodeuii/**/*.js")
        .pipe(babel({
            babelrc: false,
            ignore: ["./src/nodeuii/config/index.js"],
            "plugins": [
                ["@babel/plugin-proposal-decorators", {
                    "legacy": true
                }], "transform-es2015-modules-commonjs"
            ]
        }))
        .pipe(gulp.dest('dist'))
});
gulp.task("buildconfig", () => {
    gulp.src("src/nodeuii/**/*.js")
        .pipe(rollup({
            output: {
                format: 'cjs'
            },
            plugins: [
                replace({
                    "process.env.NODE_ENV": JSON.stringify('production')
                })
            ],
            input: './src/nodeuii/config/index.js'
        }))
        .pipe(gulp.dest('dist'))
})
let _task = ["builddev"];
if (process.env.NODE_ENV == 'production') {
    // _task = ["buildprod","buildconfig"];
    _task = gulpSequence("buildprod", "buildconfig")
}

gulp.task("default", _task);