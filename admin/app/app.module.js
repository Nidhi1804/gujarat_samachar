angular
	.module('gujaratSamachar', [
		'ngResource',
		'ui.router',
		'ngAnimate',
		'ngSanitize',
		'oc.lazyLoad',
		'ui.bootstrap',
		'toastr',
		'angularFileUpload',
		'localytics.directives',
		'gujaratSamachar.user',
		'gujaratSamachar.config',
		'gujaratSamachar.adminPanel',
		'datePicker',
		'ui.sortable',
		'angularMoment',
		'summernote'
	])
	.config(config)
	.run(run);


/* App Run */
function run($rootScope, GENERAL_CONFIG, $state, $transitions){
	$rootScope.app_base_url = GENERAL_CONFIG.app_base_url;
	$rootScope.errorImagePath = GENERAL_CONFIG.errorImagePath;
	$transitions.onSuccess({}, function() {
		if($state.current.data) {
			$rootScope.pageTitle = $state.current.data.pageTitle;
		}else{
			$rootScope.pageTitle = '';
		}
	});
}

/* App Config */
function config($httpProvider, $provide) {
	$httpProvider.interceptors.push('httpInterceptorService');
	$httpProvider.interceptors.push('errorHandler');// Handle SESSION_TIMED_OUT error
	/*
		 * Fix for Angular IE Caching issue for $http()
	 * https://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http
	 * http://www.oodlestechnologies.com/blogs/AngularJS-caching-issue-for-Internet-Explorer
	 */
	$httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
	$httpProvider.defaults.cache = false;

	//Initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}

	// Disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

	// Set initial date input value blank instead of today date using angular-datpicker
	$provide.decorator('mFormatFilter', function () {
		return function (m, format, tz) {
			if (!(moment.isMoment(m))) {
				return '';
			}
			return tz ? moment.tz(m, tz).format(format) : m.format(format);
		};
	});
}

angular.module('gujaratSamachar.config', []);
var hostname = window.location.hostname;
if(hostname == 'localhost')
	hostname = hostname + ':4444';
else
	hostname = hostname.replace('admin.','');
var webaApp_base_url = window.location.protocol + "//" + hostname;
var config_data = {
	'GENERAL_CONFIG': {
		'webaApp_base_url': webaApp_base_url,
		'app_base_url': window.location.origin,
		'app_image_url':'assets/images/',
		'avertisePositions' : [
			{id:1, value: 'Header', name:"Header (728*100)"},
			{id:2, value: 'Header2', name:"Header2 (728*100)"},
			{id:3, value: 'Article-Header3', name:"Article-Header3 (690*100)"},
			{id:4, value: 'Article-Header4', name:"Article-Header4 (728*100)"},
			{id:5, value: 'List', name:"List (774*90)"},
			{id:6, value: 'Middle1', name:"Middle1 (728*90)"},
			{id:7, value: 'Middle2', name:"Middle2 (728*90)"},
			{id:8, value: 'Middle3', name:"Middle3 (600*300)"},
			{id:9, value: 'Middle4', name:"Middle4 (600*300)"},
			{id:10, value: 'Bottom 1', name:"Bottom 1 (300*300)" },
			{id:11, value: 'Bottom 2', name:"Bottom 2 (300*300)"},
			{id:12, value: 'Bottom 1 + Bottom 2', name:"Bottom 1 + Bottom 2 (600*300)"},
			{id:13, value: 'Right 1', name:"Right 1 (300*300)"},
			{id:14, value: 'Right 2', name:"Right 2 (300*300)"},
			{id:15, value: 'Right 3', name:"Right 3 (300*300)"},
		],
		'avertiseMobilePositions' : [
			{id:1, value: 'Above Story Box', name:"Above Story Box"},
			{id:2, value: 'Above Top Read News Box', name:"Above Top Read News Box"},
			{id:3, value: 'Above City News Box', name:"Above City News Box"},
			{id:4, value: 'Above Category Box1', name:"Above Category Box1"},
			{id:5, value: 'Above Category Box2', name:"Above Category Box2"},
			{id:6, value: 'Above Category Box3', name:"Above Category Box3"},
			{id:7, value: 'Above Category Box4', name:"Above Category Box4"},
			{id:8, value: 'Above Recent News Box', name:"Above Recent News Box"},
			{id:9, value: 'Above GS Plus Box', name:"Above GS Plus Box"},
			{id:10, value: 'Above Gallery Box', name:"Above Gallery Box" },
			{id:11, value: 'Above Magazine Box', name:"Above Magazine Box"},
			{id:12, value: 'Above List Box', name:"Above List Box"},
			{id:13, value: 'Above Article Box', name:"Above Article Box"},
			{id:14, value: 'Above Slide Show List Box', name:"Above Slide Show List Box"},
			{id:15, value: 'Above Photo Gallery List Box', name:"Above Photo Gallery List Box"},
			{id:16, value: 'Above Video Gallery Box', name:"Above Video Gallery Box"},
			{id:17, value: 'Above Releted News Box', name:"Above Releted News Box"},
		],
		'pageType': [
			{ key:'home', name:'Home' },
			{ key:'category', name:'Category' },
			{ key:'photo-gallery', name:'Photo Gallery' },
			{ key:'video-gallery', name:'Video Gallery' },
			{ key:'slide-show', name:'Slide Show' },
			{ key:'magazine', name:'Magazine' },
			{ key:'city', name:'Gujarat City' },
		],
		'adevrtisefileType' : ['Image', 'Google Code'],
		'errorImagePath': 'assets/images/default.png'
	}
}
if (!window.location.origin) { // Some browsers (mainly IE) does not have this property, so we need to build it manually...
  config_data.GENERAL_CONFIG.app_base_url = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
}

angular.forEach(config_data,function(key,value) {
	angular.module('gujaratSamachar.config').constant(value,key);
});
