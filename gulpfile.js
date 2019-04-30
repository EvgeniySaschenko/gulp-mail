const gulp = require('gulp');
const inlineCss = require('gulp-inline-css');
const cssBase64 = require('gulp-css-base64');
const browserSync = require('browser-sync'); // Сервер
const pug = require('gulp-pug'); // HTML преероцессор
const sass = require('gulp-sass'); // CSS преероцессор
const plumber = require('gulp-plumber'); // В случае ошибки в PUG или SASS сервер не падает
const clean = require('gulp-clean'); // Удаление папок / файлов - тут нигде не используется
const runSequence = require('run-sequence'); // Последовательность задач

gulp.task('serve', () => {
		browserSync.init({
			server: {
				baseDir: "./build"
			}
		})

		gulp.watch('src/pages/**/img/', ['img']);
		gulp.watch('src/**/*.{sass,pug}', ['sass', 'pug']);
		gulp.watch('build/**/*.*').on('change', browserSync.reload)
});

// IMG
gulp.task('img', () => {
	return gulp.src('src/pages/**/img/*.{png,jpeg,jpg,gif}', {base: 'src/pages/'})
		.pipe(gulp.dest('build'))
})

// SASS
gulp.task('sass', () => {
	return gulp.src('src/pages/**/*.sass', {base: 'src/pages/'})
		.pipe(plumber())
		.pipe(sass())
		//.pipe(cssBase64())
	.pipe(gulp.dest('tmp'));
});

// PUG
gulp.task('pug', () => {
	return gulp.src('src/pages/**/*.pug', {base: 'src/pages/'})
		.pipe(plumber())
		.pipe(pug( { pretty: true } ))
		.pipe(gulp.dest('tmp'))
		.pipe(inlineCss({
				removeHtmlSelectors: 'class',
				removeStyleTags: false
			}))
		.pipe(gulp.dest('build'));
});

// Удаление build
gulp.task('clean-build', () => {
	return gulp.src('./build', {force: true})
		.pipe(clean());
});

// Удаление tmp
gulp.task('clean-tmp', () => {
	return gulp.src('./tmp', {force: true})
	.pipe(clean());
});

gulp.task('default', ()=> {
	runSequence('clean-build', 'clean-tmp', 'img', 'sass', 'pug', ['serve']);
});