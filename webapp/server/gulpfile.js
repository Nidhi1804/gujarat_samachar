let gulp = require('gulp');
let concat = require('gulp-concat');
let ngAnnotate = require('gulp-ng-annotate');
let plumber = require('gulp-plumber');

// let cachebust = require('gulp-cachebust')
// let browserify = require('gulp-browserify');
let uglify = require('gulp-uglify');
let bytediff = require('gulp-bytediff');
let rename = require('gulp-rename');
let babel = require('gulp-babel');
let es2015 = require('babel-preset-es2015');
let minifyCSS = require('gulp-minify-css');
let autoprefixer = require('gulp-autoprefixer');
const arr = [
	'../app/app.module.js',
	'../app/modules/main/main.module.js',
	'../app/component/news-box/newsBoxController.js',
	'../app/modules/main/home/home.controller.js',
	'../app/component/gallery-slider-box/gallerySlideBox.controller.js',
	'../app/component/story-box/storyBoxController.js',
	'../app/component/magazine-box/magazineBoxController.js',
	'../app/component/right-side-news/rightSideNewsController.js',
	'../app/services/main.service.js',
	'../app/services/ad.service.js',
	'../app/services/asyncData.service.js',
	'../app/services/staticPage.service.js',
	'../app/services/httpInterceptor.service.js',
	'../app/services/shareData.service.js',
	'../app/services/meta.service.js',
	'../app/directives/iCheck.directive.js',
	'../app/directives/gsLoader.directive.js',
	'../app/directives/mobileMenu.directive.js',
	'../app/directives/mobileAdv.directive.js',
	'../app/directives/ad.directive.js',
	'../app/directives/bottomAdvertise.directive.js',
	'../app/directives/headerAdvertise.directive.js',
	'../app/directives/imageSrcErr.directive.js',
	'../app/directives/jsonld.directive.js',
	'../app/directives/scroll.directive.js',
	'../app/component/gallery-slider-box/gallerySliderBox.component.js',
	'../app/component/news-box/newsBox.component.js',
	'../app/component/story-box/storyBox.component.js',
	'../app/component/magazine-box/magazineBox.component.js',
	'../app/filter/filter.js',
	'../app/partial-views/header.controller.js',
	'../app/partial-views/footer.controller.js',
	'../app/partial-views/sidebar/topReadNews/topReadNews.controller.js',
	'../app/partial-views/sidebar/recentPost/recentPost.controller.js',
	'../app/partial-views/mainSidebar.controller.js',
	'../app/component/right-side-news/rightSideNews.component.js'
];

const libs = [
	// '../app/bower_components/angular/angular.min.js',
	// '../app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
	 '../app/bower_components/angular-resource/angular-resource.min.js',
	'../app/bower_components/angular-animate/angular-animate.min.js',
	'../app/bower_components/angular-sanitize/angular-sanitize.min.js',
	'../app/bower_components/angular-bootstrap/ui-bootstrap.min.js',
	'../app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
	'../app/bower_components/oclazyload/dist/ocLazyLoad.min.js',
	'../app/assets/js/custom.js',
	// '../app/bower_components/nprogress/nprogress.js',
	// '../app/bower_components/iCheck/icheck.min.js',
	'../app/bower_components/angular-cookies/angular-cookies.js',
	'../app/bower_components/chosen/chosen.jquery.js',
	'../app/bower_components/angular-chosen-localytics/dist/angular-chosen.min.js',
	// '../app/bower_components/moment/min/moment.min.js',
	// '../app/bower_components/moment-timezone/builds/moment-timezone.min.js',
	// '../app/bower_components/angular-moment/angular-moment.min.js',
	// '../bower_components/angular-datepicker/dist/angular-datepicker.min.js',
	'../app/bower_components/slick-carousel/slick/slick.js',
	'../app/bower_components/angular-slick-carousel/dist/angular-slick.min.js',
	'../app/bower_components/angularUtils-pagination/dirPagination.js',
	'../app/assets/js/deeplink.js',
	'../app/bower_components/angular-fancybox-plus/js/angular-fancybox-plus.js',
	'../app/assets/js/jquery.carouselTicker.min.js'
];




gulp.task('build', [], function() {
	return gulp.src('../app/index.html')
		.pipe(cachebust.references())
		.pipe(gulp.dest('../app/dist'));
});

gulp.task('app', function() {
	return gulp.src(arr)
		.pipe(plumber())
		.pipe(babel({
			presets: [es2015]
		}))
		.pipe(concat('app.js', {
			newLine: ';'
		}))
		.pipe(ngAnnotate({
			add: true
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('../app/src/'));
});

gulp.task('libs', function() {
	return gulp.src(libs)
		.pipe(plumber())
		.pipe(babel({
			presets: [es2015]
		}))
		.pipe(concat('libs.js', {
			newLine: ';'
		}))
		.pipe(ngAnnotate({
			add: true
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('../app/src/'));
});


gulp.task('prod', ['app'], function() {
	return gulp.src('../app/src/app.js')
		.pipe(plumber())
		.pipe(babel({
			presets: [es2015]
		}))
		.pipe(bytediff.start())
		.pipe(uglify({
			mangle: true
		}))
		.pipe(bytediff.stop())
		.pipe(rename('app.min.js'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('../app/src/'));
});

let cssArr = [
	'../app/src/main.min.css',
	'../app/src/custom.min.css',
	'../app/assets/css/bootstrap.min.css',
	'../app/assets/css/Roboto-font.css',
	'../app/assets/css/guj-rase-font.css',
	'../app/bower_components/slick-carousel/slick/slick.css',
	'../app/bower_components/slick-carousel/slick/slick-theme.css',
	'../app/bower_components/summernote/dist/summernote.css'
];

let customCss = [
	'../app/assets/css/custom.css'
];

let mainCss = [
	'../app/assets/css/main.css',
];

let fancyBoxCss = [
	'../app/bower_components/fancybox-plus/css/jquery.fancybox-plus.css',
];



gulp.task('css', function() {
	// Single entry point to browserify
gulp.src(cssArr)
    .pipe(minifyCSS())
   .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('../app/src/'))
});

gulp.task('custom', function() {
	gulp.src(customCss)
    .pipe(minifyCSS())
    .pipe(concat('custom.min.css'))
    .pipe(gulp.dest('../app/src/'))
});

gulp.task('main', function() {
	gulp.src(mainCss)
    .pipe(minifyCSS())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('../app/src/'))
});

gulp.task('fancyBox', function() {
	gulp.src(fancyBoxCss)
    .pipe(minifyCSS())
    .pipe(concat('fancyBox.min.css'))
    .pipe(gulp.dest('../app/src/'))
});


// Basic usage
gulp.task('scripts', function() {
	// Single entry point to browserify
	gulp.src('../app/src/app.js')
		.pipe(browserify({
			insertGlobals: true,
			debug: !gulp.env.production
		}))
		.pipe(gulp.dest('../app/src/'))
});