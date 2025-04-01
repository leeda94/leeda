import gulp from "gulp";
import { deleteAsync } from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
//import imagemin from "gulp-imagemin";
//import optipng from "imagemin-optipng";
//import gifsicle from "imagemin-gifsicle";
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";

// export const dev = () => console.log("i will dev!");

const routes = {
  img: {
    src: "src/img/*",
    dest: "dist/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/**/*.scss",
    dest: "dist/css",
  },
  js: {
    watch: "src/js/**/*.js",
    src: ["src/js/**/*.js", "!src/js/lib/**/*.js"],
    dest: "dist/js",
    libSrc: "src/js/lib/**/*.js",
    libDest: "dist/js/lib",
  },
  html: {
    src: "src/*.html",
    dest: "dist/",
  },
};

const clean = () => deleteAsync(["dist"]);

const webserver = () =>
  gulp.src("dist").pipe(ws({ livereload: true, open: true }));
// gulp.src("dist").pipe(
//   ws({
//     livereload: true,
//     open: true,
//     host: "0.0.0.0",
//     port: 8000,
//   })
// );

const html = () => gulp.src(routes.html.src).pipe(gulp.dest(routes.html.dest));

const img = () =>
  gulp
    .src(routes.img.src, { encoding: false })
    // .pipe(
    //   imagemin(
    //     [
    //       optipng({ optimizationLevel: 5 }), // PNG 최적화
    //       gifsicle({ interlaced: true }), // GIF 최적화
    //     ],
    //     {
    //       verbose: true,
    //       maxBuffer: 1024 * 1024 * 10, // 예: 10MB로 설정
    //     }
    //   )
    // )
    .pipe(
      image({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        gifsicle: true,
        svgo: true,
        concurrent: 10,
        quiet: true,
      })
    )
    .pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest))
    .on("end", () => {
      gulp.src(routes.js.libSrc).pipe(gulp.dest(routes.js.libDest));
    });

const gh = () => gulp.src("dist/**/*").pipe(ghPages());

const watch = () => {
  gulp.watch(routes.html.src, html);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean]);
const assets = gulp.series([html, styles, js, img]);
const live = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([prepare, assets, live]);
export const deploy = gulp.series([build, gh, clean]);
