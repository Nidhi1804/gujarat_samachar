(function() {
    'use strict';
    angular
        .module('gujaratSamachar', [
            'ngResource',
            'ui.router',
            'ngAnimate',
            'ngSanitize',
            'oc.lazyLoad',
            'ui.bootstrap',
            'localytics.directives', // Angular directive for chosen
            'gujaratSamachar.main',
            'gujaratSamachar.config',
            'datePicker',
            'slickCarousel',
            'angularMoment',
            'ngCookies'
        ])
        .config(config)
        .run(run);

    /* App Run */
    function run($timeout, $window, $rootScope, GENERAL_CONFIG, $state, $transitions, metaService, $location) {
        $rootScope.$state = $state;
        $rootScope.app_base_url = GENERAL_CONFIG.app_base_url;
        $rootScope.errorImagePath = GENERAL_CONFIG.errorImagePath;
        $rootScope.metaservice = metaService;
        $rootScope.more = function() {
            $rootScope.stopLoadingData = false;
            $rootScope.loading = false;
        }
        $transitions.onSuccess({}, function() {  
            $timeout(function() {
                gtag('config', 'UA-38699406-1', {'page_path': $location.url(),'page_title' : $state.current.data.pageTitle + 'Gujarat Samachar : World \'s Leading Gujarati Newspaper'});
            }, 500);
            if($state.current.name == 'root.mainSidebar.home'){
                $rootScope.stopLoadingData = true;
            }
            if ($state.current.data) {
                $rootScope.pageTitle = $state.current.data.pageTitle;
            } else {
                $rootScope.pageTitle = '';
            }  
            $rootScope.currentUrl = $location.absUrl();
        });
        if (navigator.userAgent.toString().search('Android') >= 0 || navigator.userAgent.toString().search('iPhone') >= 0) {
            $rootScope.isMobile = true;
        } else {
            $rootScope.isMobile = false;
        }
    }

    /* App Config */
    function config($httpProvider, $provide) {
        //$httpProvider.interceptors.push('httpInterceptorService');
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
        $provide.decorator('mFormatFilter', function() {
            return function(m, format, tz) {
                if (!(moment.isMoment(m))) {
                    return '';
                }
                return tz ? moment.tz(m, tz).format(format) : m.format(format);
            };
        });
    }

    angular.module('gujaratSamachar.config', []);
    //var image_base_url = window.location.protocol + "//" + window.location.hostname + ":" + (parseInt(window.location.port) + 1111)
    var hostname = window.location.hostname;
    hostname = hostname.replace('www.','');
    var imageOrigin;
    imageOrigin = 'server';

    if(imageOrigin == 'server')
        var image_base_url = window.location.protocol + "//static." + hostname;
    else
        var image_base_url = 'https://dlfbv97u99p9c.cloudfront.net/static';
    var config_data = {
        'GENERAL_CONFIG': {
            'app_base_url': window.location.origin,
            'image_base_url': image_base_url,
            'article_images_base_url': image_base_url + '/articles/articles_thumbs',
            'article_thumb_images_base_url': image_base_url + '/articles/articles_thumbs/thumbnails',
            'homeCategory': '597592d5c2d31873b24071b3',
            'slickSliderConfig': {
                autoplay: true,
                initialSlide: 3,
                infinite: true,
                arrows: false,
                responsive: [{
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ],
                method: {}
            },
            'gsPlusMagazineSlug': 'gujarat-samachar-plus',
            'file_version': '?v.0.0.52',
            'errorImagePath': window.location.origin+'/assets/images/default.png'
        }
    }
    if (!window.location.origin) { // Some browsers (mainly IE) does not have this property, so we need to build it manually...
        config_data.GENERAL_CONFIG.app_base_url = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
    }
    angular.forEach(config_data, function(key, value) {
        angular.module('gujaratSamachar.config').constant(value, key);
    });
})();