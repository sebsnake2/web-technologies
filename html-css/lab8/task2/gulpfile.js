const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");

function styles() {
    return gulp
        .src("video13/css/styles.css")
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(gulp.dest("build"));
}

function watchFiles() {
    gulp.watch("video13/css/styles.css", styles);
}

exports.styles = styles;
exports.watch = watchFiles;

exports.default = gulp.series(styles, watchFiles);
