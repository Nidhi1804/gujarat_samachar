'use strict';

categoryDataService.$inject = ["$q", "mainService"];
megazineDataService.$inject = ["$q", "mainService"];
cityDataService.$inject = ["$q", "mainService"];
sectionFlagDataService.$inject = ["$q", "mainService"];
metaService.$inject = ["GENERAL_CONFIG"];
icheck.$inject = ["$timeout"];
imagePathFilter.$inject = ["GENERAL_CONFIG", "$state"];
arrayChunk.$inject = ["GENERAL_CONFIG"];
unsafe.$inject = ["$sce"];
(function () {
    'use strict';

    config.$inject = ["$httpProvider", "$provide"];
    run.$inject = ["$timeout", "$window", "$rootScope", "GENERAL_CONFIG", "$state", "$transitions", "metaService", "$location"];
    angular.module('gujaratSamachar', ['ngResource', 'ui.router', 'ngAnimate', 'ngSanitize', 'oc.lazyLoad', 'ui.bootstrap', 'localytics.directives', // Angular directive for chosen
    'gujaratSamachar.main', 'gujaratSamachar.config', 'datePicker', 'slickCarousel', 'angularMoment', 'ngCookies']).config(config).run(run);

    /* App Run */
    function run($timeout, $window, $rootScope, GENERAL_CONFIG, $state, $transitions, metaService, $location) {
        $rootScope.$state = $state;
        $rootScope.app_base_url = GENERAL_CONFIG.app_base_url;
        $rootScope.errorImagePath = GENERAL_CONFIG.errorImagePath;
        $rootScope.metaservice = metaService;
        $rootScope.more = function () {
            $rootScope.stopLoadingData = false;
            $rootScope.loading = false;
        };
        $transitions.onSuccess({}, function () {
            $timeout(function () {
                gtag('config', 'UA-38699406-1', { 'page_path': $location.url(), 'page_title': $state.current.data.pageTitle + 'Gujarat Samachar : World \'s Leading Gujarati Newspaper' });
            }, 500);
            if ($state.current.name == 'root.mainSidebar.home') {
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
        $provide.decorator('mFormatFilter', function () {
            return function (m, format, tz) {
                if (!moment.isMoment(m)) {
                    return '';
                }
                return tz ? moment.tz(m, tz).format(format) : m.format(format);
            };
        });
    }

    angular.module('gujaratSamachar.config', []);
    //var image_base_url = window.location.protocol + "//" + window.location.hostname + ":" + (parseInt(window.location.port) + 1111)
    var hostname = window.location.hostname;
    hostname = hostname.replace('www.', '');
    var imageOrigin;
    imageOrigin = 'server';

    if (imageOrigin == 'server') var image_base_url = window.location.protocol + "//static." + hostname;else var image_base_url = 'https://dlfbv97u99p9c.cloudfront.net/static';
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
                }, {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }, {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }],
                method: {}
            },
            'gsPlusMagazineSlug': 'gujarat-samachar-plus',
            'file_version': '?v.0.0.52',
            'errorImagePath': window.location.origin + '/assets/images/default.png'
        }
    };
    if (!window.location.origin) {
        // Some browsers (mainly IE) does not have this property, so we need to build it manually...
        config_data.GENERAL_CONFIG.app_base_url = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
    angular.forEach(config_data, function (key, value) {
        angular.module('gujaratSamachar.config').constant(value, key);
    });
})();;'use strict';

(function () {
    'use strict';

    run.$inject = ["$state", "$transitions", "$trace", "$rootScope"];
    angular.module('gujaratSamachar.main', ['ui.router', 'ngResource', 'gujaratSamachar.config', 'angularUtils.directives.dirPagination']).config(config).run(run);
    config.$inject = ['GENERAL_CONFIG', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$stateProvider', '$ocLazyLoadProvider'];

    function config(GENERAL_CONFIG, $urlRouterProvider, $locationProvider, $httpProvider, $stateProvider, $ocLazyLoadProvider) {
        //$locationProvider.html5Mode(true).hashPrefix('!');
        $locationProvider.html5Mode({ enabled: true, requireBase: true }).hashPrefix('!');
        $urlRouterProvider.otherwise('/');
        var version = GENERAL_CONFIG.file_version;
        $stateProvider.state('root', {
            abstract: true,
            views: {
                '@': {
                    templateUrl: 'partial-views/main.view.html'
                },
                'header@root': {
                    templateUrl: 'partial-views/header.view.html',
                    controller: 'HeaderController as vm'
                },
                'footer@root': {
                    templateUrl: 'partial-views/footer.view.html',
                    controller: 'FooterController as vm'
                }
            }
        }).state('root.404', {
            url: '/404',
            templateUrl: 'partial-views/404.view.html'
        }).state('root.mainSidebar', {
            views: {
                '': {
                    templateUrl: 'partial-views/mainSidebar.view.html',
                    controller: 'MainSidebarController as vm'
                },
                'topReadNews@root.mainSidebar': {
                    templateUrl: 'partial-views/sidebar/topReadNews/topReadNews.view.html',
                    controller: 'TopReadNewsController as vm'
                },
                'recentPost@root.mainSidebar': {
                    templateUrl: 'partial-views/sidebar/recentPost/recentPost.view.html',
                    controller: 'RecentPostController as vm'
                },
                'magazine@root.mainSidebar': {
                    templateUrl: 'partial-views/sidebar/magazine/magazine.view.html'
                },
                'relatedNews@root.mainSidebar': {
                    templateUrl: 'partial-views/sidebar/relatedNews/relatedNews.view.html'
                }
            }
        }).state('root.mainSidebar.home', {
            url: '/',
            views: {
                '': {
                    templateUrl: 'modules/main/home/home.view.html',
                    controller: 'HomeController as vm'
                },
                'articlesByCity@root.mainSidebar.home': {
                    templateUrl: 'modules/main/home/articlesByCity/articlesByCity.view.html',
                    controller: 'ArticlesByCityController as vm'
                },
                'articlesByCategory@root.mainSidebar.home': {
                    templateUrl: 'modules/main/home/articlesByCategory/articlesByCategory.view.html',
                    controller: 'ArticlesByCategoryController as vm'
                },
                'breakingNews@root.mainSidebar.home': {
                    templateUrl: 'modules/main/home/breakingNews/breakingNews.view.html',
                    controller: 'BreakingNewsController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/home/articlesByCity/articlesByCity.controller.js" + version, "modules/main/home/articlesByCategory/articlesByCategory.controller.js" + version, "bower_components/fancybox-plus/css/jquery.fancybox-plus.css" + version, "bower_components/fancybox-plus/dist/jquery.fancybox-plus.js" + version, "bower_components/angular-fancybox-plus/js/angular-fancybox-plus.js" + version, "modules/main/home/breakingNews/breakingNews.controller.js" + version, "directives/imageLoading.directive.js" + version]
                    });
                }]
            },
            data: { pageTitle: '' }
        }).state('root.mainSidebar.articleDetails', {
            url: '/news/:categorySlug/:articleUrl',
            params: {
                url: {
                    value: null,
                    squash: true
                }
            },
            views: {
                '': {
                    templateUrl: 'modules/main/articleDetails/articleDetails.view.html',
                    controller: 'ArticleDetailsController as vm'
                },
                'articlesByCity@root.mainSidebar.articleDetails': {
                    templateUrl: 'modules/main/home/articlesByCity/articlesByCity.view.html',
                    controller: 'ArticlesByCityController as vm'
                },
                'articlesByCategory@root.mainSidebar.articleDetails': {
                    templateUrl: 'modules/main/home/articlesByCategory/articlesByCategory.view.html',
                    controller: 'ArticlesByCategoryController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/articleDetails/articleDetails.controller.js" + version, "directives/disqusComments.directive.js" + version, "modules/main/home/articlesByCity/articlesByCity.controller.js" + version, "modules/main/home/articlesByCategory/articlesByCategory.controller.js" + version, "bower_components/angular-socialshare/dist/angular-socialshare.min.js" + version]
                    });
                }]
            },
            data: { pageTitle: '' }
        }).state('root.mainSidebar.articleList', { // Id will be unique for each category
            url: '/:listType/:slug/:pageIndex?date', //listType : category/city
            views: {
                '': {
                    templateUrl: 'modules/main/articleList/articleList.view.html',
                    controller: 'ArticleListController as vm'
                }
            },
            params: {
                Id: '',
                squash: true
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/articleList/articleList.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: '' }
        }).state('root.mainSidebar.rss', {
            url: '/rss',
            views: {
                '': {
                    templateUrl: 'partial-views/rss.view.html',
                    controller: 'RssController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["partial-views/rss.controller.js" + version]
                    });
                }]
            }
        }).state('root.mainSidebar.meta', {
            url: '/tags/:metaTag/:pageIndex?date', //listType : single metaTag list page
            views: {
                '': {
                    templateUrl: 'modules/main/articleList/articleList.view.html',
                    controller: 'metaController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/articleList/metaTag/metaTag.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: '' }
        }).state('root.mainSidebar.articleByMagazine', {
            url: '/magazine/:slug/:pageIndex?date',
            views: {
                '': {
                    templateUrl: 'modules/main/magazine/articleByMagazine.view.html',
                    controller: 'articleByMagazine as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/magazine/articleByMagazine.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: '' }
        }).state('root.mainSidebar.slideShow', {
            url: '/photo/:pageIndex?date',
            views: {
                '': {
                    templateUrl: 'modules/main/slideShow/slideShowHome.view.html',
                    controller: 'SlideShowController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/slideShow/slideShowHome.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: 'Slide Show | ' }
        }).state('root.mainSidebar.photoGallery', {
            url: '/gs_photo/:pageIndex',
            views: {
                '': {
                    templateUrl: 'modules/main/photoGallery/photoGalleryList.view.html',
                    controller: 'PhotoGalleryListController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/photoGallery/photoGalleryList.controller.js" + version, "bower_components/fancybox-plus/css/jquery.fancybox-plus.css" + version, "bower_components/fancybox-plus/dist/jquery.fancybox-plus.js" + version, "bower_components/angular-fancybox-plus/js/angular-fancybox-plus.js" + version, "directives/windowResize.directive.js" + version]
                    });
                }]
            },
            data: { pageTitle: 'Photo Gallery | ' }
        }).state('root.mainSidebar.slideShowDetails', {
            url: '/photo_slide_show/:url/:Id',
            views: {
                '': {
                    templateUrl: 'modules/main/slideShow/slideShowDetails.view.html',
                    controller: 'SlideShowDetailsController as vm'
                },
                'articlesByCity@root.mainSidebar.slideShowDetails': {
                    templateUrl: 'modules/main/home/articlesByCity/articlesByCity.view.html',
                    controller: 'ArticlesByCityController as vm'
                },
                'articlesByCategory@root.mainSidebar.slideShowDetails': {
                    templateUrl: 'modules/main/home/articlesByCategory/articlesByCategory.view.html',
                    controller: 'ArticlesByCategoryController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/slideShow/slideShowDetails.controller.js" + version, "directives/windowResize.directive.js" + version, "modules/main/home/articlesByCity/articlesByCity.controller.js" + version, "modules/main/home/articlesByCategory/articlesByCategory.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: '' }
        }).state('root.staticPage', {
            url: '/static-page/:pageType',
            templateUrl: 'partial-views/staticPage/staticPage.view.html',
            controller: 'StaticPageController as vm',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load("partial-views/staticPage/staticPage.controller.js" + version);
                }]
            },
            data: { pageTitle: '' }
        }).state('root.sitemap', {
            url: '/sitemap',
            templateUrl: 'modules/main/sitemap/sitemap.view.html',
            controller: 'sitemapController as vm',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load("modules/main/sitemap/sitemap.controller.js" + version);
                }]
            },
            data: { pageTitle: 'Sitemap | ' }
        }).state('root.mainSidebar.videoGalleryList', {
            url: '/video-gallery/list/:pageIndex',
            views: {
                '': {
                    templateUrl: 'modules/main/videoGallery/videoGalleryList.view.html',
                    controller: 'VideoGalleryListController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/videoGallery/videoGalleryList.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: 'Video Gallery | ' }
        }).state('root.mainSidebar.videoGalleryDetails', {
            url: '/video-gallery-details/:url/:Id',
            views: {
                '': {
                    templateUrl: 'modules/main/videoGallery/videoGalleryDetails.view.html',
                    controller: 'VideoGalleryDetailsController as vm'
                },
                'articlesByCity@root.mainSidebar.videoGalleryDetails': {
                    templateUrl: 'modules/main/home/articlesByCity/articlesByCity.view.html',
                    controller: 'ArticlesByCityController as vm'
                },
                'articlesByCategory@root.mainSidebar.videoGalleryDetails': {
                    templateUrl: 'modules/main/home/articlesByCategory/articlesByCategory.view.html',
                    controller: 'ArticlesByCategoryController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/videoGallery/videoGalleryDetails.controller.js" + version, "directives/windowResize.directive.js" + version, "modules/main/home/articlesByCity/articlesByCity.controller.js" + version, "modules/main/home/articlesByCategory/articlesByCategory.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: '' }
        }).state('root.mainSidebar.metaTagList', {
            url: '/meta-tags/:articleId/:pageIndex?&date&metaTag',
            views: {
                '': {
                    templateUrl: 'modules/main/metaTag/metaTagList.view.html',
                    controller: 'MetaTagController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/metaTag/metaTagList.controller.js" + version]
                    });
                }]
            }
        }).state('root.mainSidebar.topReadNewsList', {
            url: '/top-read-news/:id/:pageIndex?date', //listType : category/city
            params: {
                id: {
                    value: null,
                    squash: true
                }
            },
            views: {
                '': {
                    templateUrl: 'modules/main/articleList/topReadNewsList/topReadNewsList.view.html',
                    controller: 'TopReadNewsListController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/articleList/topReadNewsList/topReadNewsList.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: 'Top Read News | ' }
        }).state('root.mainSidebar.topHeadingNewsList', {
            url: '/top-Head-news/:id/:pageIndex?date', //listType : category/city
            params: {
                id: {
                    value: null,
                    squash: true
                }
            },
            views: {
                '': {
                    templateUrl: 'modules/main/articleList/topHeadingNewsList/topHeadingNewsList.html',
                    controller: 'topHeadingNewsListController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/articleList/topHeadingNewsList/topHeadingNewsList.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: 'Top Head News | ' }
        }).state('root.mainSidebar.recentNewsList', {
            url: '/recent-news/:id/:pageIndex?date', //listType : category/city
            params: {
                id: {
                    value: null,
                    squash: true
                }
            },
            views: {
                '': {
                    templateUrl: 'modules/main/articleList/recentNewsList/recentNewsList.view.html',
                    controller: 'recentNewsListController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/articleList/recentNewsList/recentNewsList.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: 'Recent News | ' }
        })
        // Section page start
        // every section has unique id and slugname will be section's title
        .state('root.mainSidebar.sectionPage', {
            url: '/special-page/:slug/:pageIndex?date',
            views: {
                '': {
                    templateUrl: 'modules/main/articleList/sectionPage/sectionPage.view.html',
                    controller: 'sectionPageController as vm'
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: ["modules/main/articleList/sectionPage/sectionPage.controller.js" + version]
                    });
                }]
            },
            data: { pageTitle: 'Special Page | ' }
        });
    }

    function run($state, $transitions, $trace, $rootScope) {
        /* Show loader on page load(On html, controller files load) */
        $rootScope.loading = true;
        //Redirect to login if not authenticated before any transition       
        //$trace.enable('TRANSITION'); /* Enable transition tracing to print transition information to the console */
        $state.defaultErrorHandler(function () {
            //Default error handler fired!
            $state.go('login');
        });
    };
})();;'use strict';

angular.module('gujaratSamachar.main').controller('newsBoxController', newsBoxController);

newsBoxController.$inject = ['$stateParams', '$rootScope', 'AdService', '$state', '$transitions', '$log', 'GENERAL_CONFIG', 'mainService', '$scope', '$q', '$filter', 'categoryDataService'];

function newsBoxController($stateParams, $rootScope, AdService, $state, $transitions, $log, GENERAL_CONFIG, mainService, $scope, $q, $filter, categoryDataService) {
    var vm = this;
    vm.getArticlesByCategory = getArticlesByCategory;
    //getMainCategories();	
    var getParams = {};
    vm.$onInit = function () {
        vm.data = JSON.parse(vm.categoryBlockData);
        vm.key = vm.key;
    };
    vm.thumbImageUrl = GENERAL_CONFIG.image_base_url + '/articles/articles_thumbs/thumbnails';
    function getArticlesByCategory(category) {
        vm.currentCategory = category;
        vm.showLoader = true;
        var params;
        if ($state.current.name == 'root.mainSidebar.articleDetails') {
            params = {
                categoryId: category._id,
                skipArticleUrl: vm.detailArticleUrl
            };
        } else {
            params = {
                categoryId: category._id
            };
        }

        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        getParams['startDate'] = startDate;
        getParams['endDate'] = endDate;
        var adMiddle3Param = angular.copy(getParams);
        adMiddle3Param['position'] = 'Middle3';
        var promises = {
            middleAd3: AdService.getMiddleAd().get(adMiddle3Param).$promise
        };
        $q.all(promises).then(function (responses) {
            if (responses.middleAd3.data && responses.middleAd3.data.length > 0) {
                vm.middleAd3 = responses.middleAd3.data[0];
                if (vm.middleAd3.fileType == 'Image') {
                    vm.middleAd3.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.middleAd3.image;
                }
            } else {
                vm.middleAd3 = '';
            }
        });
        /* Article list based on date on page load(Last published article date) */
        mainService.stories().get(params, function (response) {
            vm.stories = response.data;
            if (vm.stories.length > 0) {
                vm.stories = $filter('imagePathFilter')(vm.stories);
            }
            vm.stories.forEach(function (story) {
                if (story.metaTag && story.metaTag.length > 0) {
                    var tagArray = [];
                    story.metaTag.forEach(function (tag) {
                        tagArray.push(tag.name);
                    });

                    story.metaTag = JSON.stringify(tagArray);
                }
            });
            var keepOngoing = true;
            vm.selectedStory = vm.stories[0];
            vm.showLoader = false;
        });
    }
    if ($rootScope.isMobile) {
        var checkCurrentState = function checkCurrentState(currentState, slug, listType) {
            var getParams = {};
            /*Sending today date from client side because of Timezone issue*/
            var today = new Date();
            var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            getParams['startDate'] = startDate;
            getParams['endDate'] = endDate;
            if (currentState == 'root.mainSidebar.home') {
                getParams['pageType'] = 'home';
                getParams['slug'] = '';
                getMobileAdvertise(getParams);
            } else {
                cleanupArticleCategories = $rootScope.$on('articleCategories', function (event, categories) {
                    getParams['pageType'] = 'category';
                    getParams['isArticle'] = true;
                    getParams['slug'] = categories; // MainCategory of article
                    getMobileAdvertise(getParams);
                    cleanupArticleCategories();
                });
            }
        };

        var getMobileAdvertise = function getMobileAdvertise(getParams) {
            AdService.getMainSectionMobileAd().get(getParams, function (response) {
                if (response.data && response.data.length > 0) {
                    vm.mobileAd = response.data;
                    angular.forEach(vm.mobileAd, function (advertise, index) {
                        if (advertise.fileType == 'Image') {
                            advertise.imageUrl = GENERAL_CONFIG.image_base_url + '/' + advertise.image;
                        }
                    });
                } else {
                    vm.mobileAd = '';
                }
            });
        };

        var cleanupArticleCategories;
        var currentState = $state.current.name;
        checkCurrentState(currentState, $stateParams.slug, $stateParams.listType);
    }
};'use strict';

angular.module('gujaratSamachar.main').controller('HomeController', HomeController);

HomeController.$inject = ['$state', '$stateParams', '$rootScope', '$log', 'mainService', '$q', '$filter', 'AdService', 'megazineDataService', 'GENERAL_CONFIG', 'sectionFlagDataService'];

function HomeController($state, $stateParams, $rootScope, $log, mainService, $q, $filter, AdService, megazineDataService, GENERAL_CONFIG, sectionFlagDataService) {
    var vm = this;
    var sectionFlags;
    vm.pageType = 'home';
    var getParams = {};
    vm.topStoriesSliderConfig = {
        autoplay: true,
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
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true
            }
        }],
        method: {}
    };

    vm.customPagingFn = customPagingFn;

    function customPagingFn(slick, index) {
        var numebr = index + 1;
        return '<a>' + numebr + '</a>';
    };

    var sectionIds = {};
    vm.showLoader = true;
    // sectionFlags : Return Section info(name, _id, value)(Sections: Top Stories, Top Sub-Stories, Top Read News, Latest News) 
    sectionFlagDataService.sectionFlags().then(function (response) {
        sectionFlags = response;
        /*Sending today date from client side because of Timezone issue*/
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        getParams['startDate'] = startDate;
        getParams['endDate'] = endDate;
        var adMiddle1Param = angular.copy(getParams);
        var adMiddle2Param = angular.copy(getParams);
        var adMiddle4Param = angular.copy(getParams);
        adMiddle1Param['position'] = 'Middle1';
        adMiddle2Param['position'] = 'Middle2';
        adMiddle4Param['position'] = 'Middle4';
        var promises = {
            magazines: megazineDataService.getMagazineData(),
            middleAd1: AdService.getMiddleAd().get(adMiddle1Param).$promise,
            middleAd2: AdService.getMiddleAd().get(adMiddle2Param).$promise,
            middleAd4: AdService.getMiddleAd().get(adMiddle4Param).$promise
        };
        $q.all(promises).then(function (responses) {
            if (responses.magazines) {
                vm.magazines = responses.magazines.documents;
                vm.magazinesLoaded = true;
            }
            if (responses.middleAd1.data && responses.middleAd1.data.length > 0) {
                vm.middleAd1 = responses.middleAd1.data[0];
                if (vm.middleAd1.fileType == 'Image') {
                    vm.middleAd1.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.middleAd1.image;
                }
            } else {
                vm.middleAd1 = '';
            }
            if (responses.middleAd2.data && responses.middleAd2.data.length > 0) {
                vm.middleAd2 = responses.middleAd2.data[0];
                if (vm.middleAd2.fileType == 'Image') {
                    vm.middleAd2.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.middleAd2.image;
                }
            } else {
                vm.middleAd2 = '';
            }
            if (responses.middleAd4.data && responses.middleAd4.data.length > 0) {
                vm.middleAd4 = responses.middleAd4.data[0];
                if (vm.middleAd4.fileType == 'Image') {
                    vm.middleAd4.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.middleAd4.image;
                }
            } else {
                vm.middleAd4 = '';
            }
        });
    });

    if ($rootScope.isMobile) {
        var checkCurrentState = function checkCurrentState(currentState, slug, listType) {
            var getParams = {};
            /*Sending today date from client side because of Timezone issue*/
            var today = new Date();
            var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            getParams['startDate'] = startDate;
            getParams['endDate'] = endDate;
            if (currentState == 'root.mainSidebar.home') {
                getParams['pageType'] = 'home';
                getParams['slug'] = '';
            }
            getMobileAdvertise(getParams);
        };

        var getMobileAdvertise = function getMobileAdvertise(getParams) {
            AdService.getMainSectionMobileAd().get(getParams, function (response) {
                if (response.data && response.data.length > 0) {
                    vm.mobileAd = response.data;
                    angular.forEach(vm.mobileAd, function (advertise, index) {
                        if (advertise.fileType == 'Image') {
                            advertise.imageUrl = GENERAL_CONFIG.image_base_url + '/' + advertise.image;
                        }
                    });
                } else {
                    vm.mobileAd = '';
                }
            });
        };

        var getRecentNews = function getRecentNews() {
            sectionFlagDataService.sectionFlags().then(function (response) {
                sectionFlags = response;
                mainService.stories().get({ sectionId: sectionFlags.recentNews._id, type: sectionFlags.recentNews.value }, function (response) {
                    vm.recentPostSliderLoaded = true;
                    vm.recentPost = response.data;
                    if (vm.recentPost.length > 0) {
                        vm.recentPost = $filter('imagePathFilter')(vm.recentPost, 'thumbImage');
                    }
                    vm.recentPost = vm.recentPost.map(function (recentPost) {
                        if (!recentPost.categorySlug) recentPost.slug = recentPost.magazineSlug;else recentPost.slug = recentPost.categorySlug;
                        return recentPost;
                    });
                });
            });
        };

        var getTopReadNews = function getTopReadNews() {
            sectionFlagDataService.sectionFlags().then(function (response) {
                sectionFlags = response;
                mainService.stories().get({ sectionId: sectionFlags.topReadNews._id, type: sectionFlags.topReadNews.value }, function (response) {
                    vm.topReadNewsSliderLoaded = true;
                    vm.topReadNews = response.data;
                    if (vm.topReadNews.length > 0) {
                        vm.topReadNews = $filter('imagePathFilter')(vm.topReadNews, 'thumbImage');
                    }
                    vm.topReadNews = vm.topReadNews.map(function (topReadNews) {
                        if (!topReadNews.categorySlug) topReadNews.slug = topReadNews.magazineSlug;else topReadNews.slug = topReadNews.categorySlug;
                        return topReadNews;
                    });
                });
            });
        };

        var getMagazineList = function getMagazineList() {
            mainService.magazineList().get({ slug: GENERAL_CONFIG.gsPlusMagazineSlug }, function (response) {
                if (response.data !== undefined && response.data.documents.length > 0) {
                    var data = response.data.documents;
                    vm.sideBarMagazineList = $filter('imagePathFilter')(data, 'thumbImage');
                    vm.sideBarMagazineList = vm.sideBarMagazineList.map(function (sideBarMagazineList) {
                        sideBarMagazineList.slug = GENERAL_CONFIG.gsPlusMagazineSlug;
                        return sideBarMagazineList;
                    });
                } else {
                    vm.sideBarMagazineList = [];
                }
                vm.magazineListLoaded = true;
            });
        };

        var cleanupArticleCategories;
        var currentState = $state.current.name;
        checkCurrentState(currentState, $stateParams.slug, $stateParams.listType);

        var sectionFlags;
        vm.topReadNews = [];
        vm.topReadNewsSlider = {
            method: {},
            autoplay: true,
            initialSlide: 3,
            infinite: true,
            arrows: false,
            dots: false,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }, {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        };
        getRecentNews();
        var sectionFlags;

        getTopReadNews();

        getMagazineList();
    }
};'use strict';

angular.module('gujaratSamachar.main').controller('gallerySlideBoxController', gallerySlideBoxController);

gallerySlideBoxController.$inject = ['$timeout', '$rootScope', '$log', 'mainService', '$q', '$filter', 'AdService', 'megazineDataService', 'GENERAL_CONFIG', 'sectionFlagDataService'];

function gallerySlideBoxController($timeout, $rootScope, $log, mainService, $q, $filter, AdService, megazineDataService, GENERAL_CONFIG, sectionFlagDataService) {
    var vm = this;
    var sectionFlags;
    vm.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show';
    vm.getVideoGalleryData = getVideoGalleryData;
    vm.getSlideData = getSlideData;
    vm.getPhotoGalleryData = getPhotoGalleryData;
    vm.previousSlide = previousSlide;
    vm.nextSlide = nextSlide;
    vm.photoGalleryFancybox = { 'titleShow': true, titlePosition: 'inside' };
    vm.photoGalleryFancyGroup = {
        'transitionIn': 'none',
        'transitionOut': 'none',
        'titlePosition': 'over',
        'titleFormat': function titleFormat(title, currentArray, currentIndex, currentOpts) {
            return '<span id="fbplus-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title + '</span>';
        }
    };
    getSlideData();
    vm.topStoriesSliderConfig = {
        autoplay: true,
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
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true
            }
        }],
        method: {}
    };
    vm.slickConfig1 = {
        autoplay: true,
        infinite: true,
        arrows: true,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: false
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }],
        method: {}
    };
    var sectionIds = {};

    //Tab Click Get Slide-show List
    function getSlideData() {
        var findObj = { location: "home" };
        vm.slideShowLoaded = false;
        vm.showLoader = true;
        mainService.slideShow().get(findObj, function (response) {
            if (response.data.documents) {
                vm.slideShows = response.data.documents.splice(0, 8);
                if (vm.slideShows.length > 0) {
                    vm.slideShows = $filter('imagePathFilter')(vm.slideShows);
                }
                vm.showLoader = false;
            }
            vm.slideShowLoaded = true;
        });
    }

    function getPhotoGalleryData() {
        var findObj = { location: "home" };
        vm.galleryListLoaded = false;
        vm.showLoader = true;
        mainService.getPhotoGalleryList().get(findObj, function (response) {
            vm.galleryList = response.data.slice(0, 8);
            if (vm.galleryList.length > 0) {
                vm.galleryList = $filter('imagePathFilter')(vm.galleryList);
                vm.showLoader = false;
            }
            vm.galleryListLoaded = true;
        });
    }

    function getVideoGalleryData() {
        var findObj = { location: "home" };
        vm.videoGalleryLoaded = false;
        vm.showLoader = true;
        mainService.videoGallery().get(findObj, function (response) {
            if (response.data.videos) {
                vm.videoGalleries = response.data.videos.splice(0, 8);
                vm.showLoader = false;
            }
            vm.videoGalleryLoaded = true;
        });
    }

    function previousSlide($event) {
        var prevBtn = angular.element(document.querySelectorAll('#arrowBtn'));
        prevBtn.removeClass('active-arrow');
        angular.element($event.currentTarget).addClass("active-arrow");
        vm.photoGalleryConfig1.method.slickPrev();
    }

    function nextSlide($event) {
        var prevBtn = angular.element(document.querySelectorAll('#arrowBtn'));
        prevBtn.removeClass('active-arrow');
        angular.element($event.currentTarget).addClass("active-arrow");
        vm.photoGalleryConfig1.method.slickNext();
    }
};'use strict';

angular.module('gujaratSamachar.main').controller('storyBoxController', storyBoxController);

storyBoxController.$inject = ['sectionFlagDataService', '$log', 'GENERAL_CONFIG', 'mainService', '$scope', '$q', '$filter', 'categoryDataService'];

function storyBoxController(sectionFlagDataService, $log, GENERAL_CONFIG, mainService, $scope, $q, $filter, categoryDataService) {
    var vm = this;
    var sectionFlags;
    vm.topStoriesSliderConfig = {
        autoplay: true,
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
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true
            }
        }],
        method: {}
    };

    var sectionIds = {};
    vm.showLoader = true;
    // sectionFlags : Return Section info(name, _id, value)(Sections: Top Stories, Top Sub-Stories, Top Read News, Latest News) 
    sectionFlagDataService.sectionFlags().then(function (response) {
        sectionFlags = response;
        var promises = {
            topStories: mainService.stories().get({ sectionId: sectionFlags.topStories._id, type: sectionFlags.topStories.value }).$promise,
            topSubStories: mainService.stories().get({ sectionId: sectionFlags.topSubStories._id, type: sectionFlags.topSubStories.value }).$promise
        };
        $q.all(promises).then(function (responses) {
            if (responses.topStories.data) {
                var topStories = responses.topStories.data;
                vm.topStories = topStories;
                if (vm.topStories.length > 0) {
                    vm.topStories = $filter('imagePathFilter')(vm.topStories);
                }
                vm.topStories = vm.topStories.map(function (topStories) {
                    if (!topStories.categorySlug) topStories.slug = topStories.magazineSlug;else topStories.slug = topStories.categorySlug;
                    return topStories;
                });
                vm.topStorySliderLoaded = true;
            }
            if (responses.topSubStories.data) {
                vm.topSubStories = responses.topSubStories.data;
                if (vm.topSubStories) {
                    vm.topSubStories = $filter('imagePathFilter')(vm.topSubStories, 'thumbImage');
                }
                vm.topSubStories = vm.topSubStories.map(function (topSubStories) {
                    if (!topSubStories.categorySlug) topSubStories.slug = topSubStories.magazineSlug;else topSubStories.slug = topSubStories.categorySlug;
                    return topSubStories;
                });
                vm.topSubStories = $filter('arrayChunk')(vm.topSubStories, 2);
            }
        });
    });
};'use strict';

angular.module('gujaratSamachar.main').controller('magazineBoxController', magazineBoxController);

magazineBoxController.$inject = ['$log', 'mainService', '$scope', '$q', '$filter', '$timeout', 'megazineDataService'];

function magazineBoxController($log, mainService, $scope, $q, $filter, $timeout, megazineDataService) {
    var vm = this;

    vm.$onInit = function () {
        vm.componentInitialize = true;
    };
    getMagazineList();

    function getMagazineList() {

        var promises = {
            magazines: megazineDataService.getMagazineData()
        };
        $q.all(promises).then(function (responses) {
            if (responses.magazines) {
                vm.magazines = responses.magazines.documents;
                vm.magazinesLoaded = true;
            }
        });
    }
};'use strict';

angular.module('gujaratSamachar.main').controller('rightSideNewsController', rightSideNewsController);

rightSideNewsController.$inject = ['$log', 'mainService', '$scope', '$q', '$filter', '$timeout', 'sectionFlagDataService'];

function rightSideNewsController($log, mainService, $scope, $q, $filter, $timeout, sectionFlagDataService) {
    var vm = this;
    vm.magazineSlug = 'gujarat-samachar-plus';
    vm.$onInit = function () {
        $timeout(function () {
            vm.componentInitialize = true;
        }, 800);
        vm.errorImagePath = 'assets/images/default.png';
    };
};'use strict';

angular.module('gujaratSamachar').factory('mainService', mainService);

mainService.$inject = ['$resource', '$http', 'GENERAL_CONFIG', '$q'];

function mainService($resource, $http, GENERAL_CONFIG, $q) {
    var service = {
        stories: stories,
        sectionFlags: sectionFlags,
        cities: cities,
        categories: categories,
        getSubCategories: getSubCategories,
        articleDetails: articleDetails,
        getArticleList: getArticleList,
        magazines: magazines,
        slideShow: slideShow,
        getCategory: getCategory,
        recentPost: recentPost,
        magazineList: magazineList,
        articlesByCategory: articlesByCategory,
        magazineName: magazineName,
        getDocumentById: getDocumentById,
        getCityInfoBySlug: getCityInfoBySlug,
        getGalleryList: getGalleryList,
        getMenuList: getMenuList,
        getPhotoGalleryList: getPhotoGalleryList,
        slideShowDetails: slideShowDetails,
        videoGallery: videoGallery,
        getMetaTagList: getMetaTagList,
        googleUrlShortener: googleUrlShortener,
        getBreakingNews: getBreakingNews,
        getAllTopReadNews: getAllTopReadNews,
        getAllTopHeadingNews: getAllTopHeadingNews,
        getAllRecentNews: getAllRecentNews,
        getArticlesBySection: getArticlesBySection
    };
    return service;

    function stories() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/stories/:sectionId');
    }

    function cities() {
        // return $resource(GENERAL_CONFIG.app_base_url + '/api/cities');
        return $resource(GENERAL_CONFIG.app_base_url + '/api/get-documents/:collectionName');
    }

    function categories() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/categories');
    }

    function getSubCategories() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/sub-categories');
    }

    function sectionFlags() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/section-flags');
    }

    function articleDetails() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/article-details/:categorySlug/:articleUrl');
    }

    function getArticleList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/article-list');
    }

    function magazines() {
        // return $resource(GENERAL_CONFIG.app_base_url + '/api/magazines');
        return $resource(GENERAL_CONFIG.app_base_url + '/api/get-documents/:collectionName');
    }

    function slideShow() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/slide-show');
    }

    function getCategory() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/article-category/:slug');
    }

    function recentPost() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/recent-post');
    }

    function magazineList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/magazine/:slug');
    }

    function articlesByCategory() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/articles-by-category');
    }

    function magazineName() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/magazine-name/:slug');
    }

    function getDocumentById() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/get-documents/:collectionName/:documentId');
    }

    function getCityInfoBySlug() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/get-city/:collectionName/:slug');
    }

    function getGalleryList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/photo-gallery');
    }

    function getMenuList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/menu/:isMobile');
    }

    function getPhotoGalleryList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/photo-gallery/home');
    }

    function slideShowDetails() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/slide-show-details/:url/:Id');
    }

    function videoGallery() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/video-gallery/:url/:Id');
    }

    function getMetaTagList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/meta-tag/list');
    }
    /*Convert to google short url*/
    function googleUrlShortener() {
        return $resource('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDHfiAm21vO1IAeBbRefnH0q2H_tMzpg54');
    }

    function getBreakingNews() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/breaking-news');
    }

    function getAllTopReadNews() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/top-read-news/:sectionId');
    }

    function getAllTopHeadingNews() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/top-head-news/:sectionId');
    }

    function getAllRecentNews() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/all-recent-news/:sectionId');
    }

    function getArticlesBySection() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/articles-by-section');
    }
};'use strict';

angular.module('gujaratSamachar').factory('AdService', AdService);

AdService.$inject = ['$resource', '$http', 'GENERAL_CONFIG', '$q'];

function AdService($resource, $http, GENERAL_CONFIG, $q) {
    var service = {
        getHeaderAd: getHeaderAd,
        getMiddleAd: getMiddleAd,
        getRightPanelAd: getRightPanelAd,
        getLeftPanelAd: getLeftPanelAd,
        getMainSectionBottomAd: getMainSectionBottomAd,
        getMainSectionMobileAd: getMainSectionMobileAd
    };

    function getHeaderAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-header');
    }

    function getMiddleAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-middle');
    }

    function getRightPanelAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-right-panel');
    }

    function getLeftPanelAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-left-panel');
    }

    function getMainSectionBottomAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-bottom');
    }

    function getMainSectionMobileAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-mobile');
    }

    return service;
};'use strict';

angular.module('gujaratSamachar').factory('categoryDataService', categoryDataService).factory('megazineDataService', megazineDataService).factory('cityDataService', cityDataService).factory('sectionFlagDataService', sectionFlagDataService);

function categoryDataService($q, mainService) {
    var promise = void 0;
    var deferred = $q.defer();
    var service = {
        getMainCategories: getMainCategories
    };
    return service;

    function getMainCategories() {
        /* Make category API call only once */
        if (!promise) {
            promise = mainService.categories();
            promise.get({ parentId: 0, type: 'article' }, function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }
        return deferred.promise;
    }

    function getMagazineData() {
        if (!megazinePromise) {
            megazinePromise = mainService.magazines();
            megazinePromise.get({ collectionName: 'Magazines' }, function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }
        return deferred.promise;
    }
}

function megazineDataService($q, mainService) {
    var promise = void 0;
    var deferred = $q.defer();
    var service = {
        getMagazineData: getMagazineData
    };
    return service;

    function getMagazineData() {
        if (!promise) {
            promise = mainService.magazines();
            promise.get({ collectionName: 'Magazines' }, function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }
        return deferred.promise;
    }
}

function cityDataService($q, mainService) {
    var promise = void 0;
    var deferred = $q.defer();
    var service = {
        getCityData: getCityData
    };
    return service;

    function getCityData() {
        if (!promise) {
            promise = mainService.cities();
            promise.get({ collectionName: 'Cities', sortBy: 'position' }, function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }
        return deferred.promise;
    }
}

function sectionFlagDataService($q, mainService) {
    var promise = void 0;
    var deferred = $q.defer();
    var service = {
        sectionFlags: sectionFlags
    };
    return service;

    function sectionFlags() {
        if (!promise) {
            var sectionIds = {
                topStories: {},
                topSubStories: {},
                topReadNews: {},
                recentNews: {}
            };
            promise = mainService.sectionFlags();
            promise.get(function (response) {
                response.data.forEach(function (section) {
                    if (section.value == "top-stories") {
                        sectionIds.topStories._id = section._id;
                        sectionIds.topStories.value = section.value;
                    } else if (section.value == "top-sub-stories") {
                        sectionIds.topSubStories._id = section._id;
                        sectionIds.topSubStories.value = section.value;
                    } else if (section.value == "top-read-news") {
                        sectionIds.topReadNews._id = section._id;
                        sectionIds.topReadNews.value = section.value;
                    } else if (section.value == "recent-news") {
                        sectionIds.recentNews._id = section._id;
                        sectionIds.recentNews.value = section.value;
                    }
                });
                deferred.resolve(sectionIds);
            });
            return deferred.promise;
        }
        return deferred.promise;
    }
};'use strict';

angular.module('gujaratSamachar').factory('StaticPageService', StaticPageService);

StaticPageService.$inject = ['$resource', '$http', 'GENERAL_CONFIG', '$q'];

function StaticPageService($resource, $http, GENERAL_CONFIG, $q) {
    var service = {
        getStaticPageData: getStaticPageData,
        addSubscribeEmail: addSubscribeEmail
    };

    function getStaticPageData() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/static-page/:pageType');
    }

    function addSubscribeEmail() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/subscribe/:emailId');
    }
    return service;
};'use strict';

angular.module('gujaratSamachar').factory('httpInterceptorService', httpInterceptorService);

// Dependency injection
httpInterceptorService.$inject = ['$q', '$rootScope'];

function httpInterceptorService($q, $rootScope) {
    // Active request count
    var requestCount = 0;

    function startRequest(config) {
        // If no request ongoing, then broadcast start event
        if (!requestCount) {
            $rootScope.$broadcast('httpLoaderStart');
            $rootScope.showLoader = true;
            NProgress.start();
        }

        requestCount++;
        return config;
    }

    function endRequest(arg) {
        // No request ongoing, so make sure we don’t go to negative count
        if (!requestCount) return;

        requestCount--;
        // If it was last ongoing request, broadcast event
        if (!requestCount) {
            $rootScope.$broadcast('httpLoaderEnd');
            $rootScope.showLoader = false;
            NProgress.done();
        }

        return arg;
    }

    // Return interceptor configuration object
    return {
        'request': startRequest,
        'requestError': endRequest,
        'response': endRequest,
        'responseError': endRequest
    };
};'use strict';

/*
 * ShareData : factory created to share data account info between two controller
 */

angular.module('gujaratSamachar').factory('shareData', function () {
    var data = {
        accountInfo: ''
    };
    return {
        get: function get(key) {
            return data[key];
        },
        set: function set(key, value) {
            data[key] = value;
        },
        clear: function clear(key) {
            delete data[key];
        }
    };
});;'use strict';

angular.module('gujaratSamachar').service('metaService', metaService);

function metaService(GENERAL_CONFIG) {
    var title = "Gujarat Samachar : World's Leading Gujarati Newspaper, Gujarati News, News in Gujarati, Gujarat News, News from Ahmedabad, Baroda, Bhuj, Bhavnagar, Rajkot, Surat, Gujarati News Headlines, Gujarati Headlines, Breaking News, 2G Spectrum Scam Exposed, 2g Scam Explained, video clip, muncipal, kite, festival, ahmedabad news, Politics news, opposition party, congress, bjp, health, relations";
    var _metaDescription = "Gujarat Samachar is world's highest selling Gujarati Newspaper. Our portal connects people of Indian diaspora worldwide. This website provides news about India, USA, Finance, Movies, Music, Bollywood, beauty and lifestyle, politics, technology and purti. We also offer classifieds for jobs and marriages. Expand your social network. Site also provides information on shopping deals, mobile phone deals, travel deals.";
    var _metaKeywords = 'News from Ahmedabad,News from Baroda,Gujarati Newspaper,Ahmedabad News,Baroda News,Gujarati News live,Gujarati, Gujrati News,Gujarat Samachar,Gujarati News,Gujarati News Paper,Gujarati News paper,gujrat,samachar,gujarati garba,news from Ahmedabad,news from Baroda,news from Surat,magazine,purti,gujarat samachar,gujarat, gujarati news, news, india, ahmedabad, narendra modi, bjp, congress, election, politics, nrg, nri, baroda, bhavnagar, rajkot, surat, vadodara, sandesh, bhaskar, times, songs, bollywood, films, movies, business, finance, rent, android, ipod, iphone, mac, phone, mobile, ring tone,usa,america,ravi purti,Gujarati News Headlines,Gujarati Headlines';
    var _metaImage = GENERAL_CONFIG.app_base_url + '/assets/images/GSlogo_200.jpg';
    var _heading;
    return {
        set: function set(newTitle, newMetaDescription, newKeywords, newImage, headLine) {
            _metaKeywords = newKeywords;
            _metaDescription = newMetaDescription;
            title = newTitle;
            _metaImage = newImage;
            _heading = headLine;
        },
        metaTitle: function metaTitle() {
            return title;
        },
        metaDescription: function metaDescription() {
            return _metaDescription;
        },
        metaKeywords: function metaKeywords() {
            return _metaKeywords;
        },
        metaImage: function metaImage() {
            return _metaImage;
        },
        heading: function heading() {
            return _heading;
        }
    };
};'use strict';

//Directive used to set metisMenu and minimalize button

angular.module('gujaratSamachar').directive('icheck', icheck);

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function link($scope, element, $attrs, ngModel) {
            return $timeout(function () {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function () {
                    element.iCheck('update');
                });

                return element.iCheck({
                    checkboxClass: 'icheckbox_square-grey',
                    radioClass: 'iradio_square-grey'

                }).on('ifChanged', function (event) {
                    if (element.attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function () {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if (element.attr('type') === 'radio' && $attrs['ngModel']) {
                        return $scope.$apply(function () {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    };
};'use strict';

angular.module('gujaratSamachar').directive('gsLoading', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'directives/gsLoader.view.html',
        scope: {
            showLoader: '=?'
        },
        controller: ["$scope", "$rootScope", function controller($scope, $rootScope) {
            $rootScope.loading = false;
        }]
    };
});

angular.module('gujaratSamachar').directive('ngSpinnerBar', ['$rootScope', '$transitions', '$timeout', function ($rootScope, $transitions, $timeout) {
    return {
        link: function link(scope, element, attrs) {

            // display the spinner bar whenever the route changes(the content part started loading)
            $transitions.onStart({}, function () {
                window.scrollTo(0, 0);
                $rootScope.loading = true;
            });

            // hide the spinner bar on rounte change success(after the content loaded)
            $transitions.onSuccess({}, function () {
                // auto scorll to page top
                $timeout(function () {
                    $rootScope.loading = false;
                    $('html,body').animate({
                        scrollTop: 0
                    }, 'slow');
                }, 500);
            });
            $timeout(function () {
                $rootScope.hideLoader = true;
            }, 1000);

            // handle errors
            $transitions.onError({}, function () {
                element.addClass('hide'); // hide spinner bar
            });

            $(element).ready(function () {
                //$rootScope.hideLoader = true;
            });
        }
    };
}]);;'use strict';

angular.module('gujaratSamachar').directive('mobileMenu', ["$window", "$timeout", function ($window, $timeout) {
    return {
        link: function link(scope, element) {
            var windowWidth = $window.innerWidth;
            $timeout(function () {
                jQuery(document).ready(function () {
                    $(".navbar button.navbar-toggle").click(function () {
                        if ($(window).width() <= 992) {
                            $(".navbar-nav .dropdownSubmenu").children('.dropdown-toggle').removeAttr('data-toggle');
                        }
                    });
                    $('.navbar-nav .dropdownSubmenu .em-level').click(function () {
                        if ($(window).width() <= 992) {
                            if ($(this).hasClass('active')) {
                                $(this).removeClass('active');
                                $(this).next('.dropdown-menu').slideUp();
                            } else {
                                $(this).addClass('active');
                                $(this).next('.dropdown-menu').slideDown();
                            }
                        }
                    });
                });
                $(window).resize(function () {
                    if ($(window).width() >= 992) {
                        $('.navbar-nav .dropdownSubmenu .em-level').removeClass('active').next('.dropdown-menu').slideUp();
                    }
                });
            }, 2500);
        }
    };
}]);;'use strict';

angular.module('gujaratSamachar').directive('mobileAdv', ["AdService", "GENERAL_CONFIG", "$stateParams", "$q", function (AdService, GENERAL_CONFIG, $stateParams, $q) {
	return {
		restrict: 'E',
		scope: {
			pageType: '@?',
			sort: '@?',
			mobileAdData: '='
		},
		templateUrl: 'directives/mobileAdv.html',
		controller: ["$scope", "$state", "$rootScope", function controller($scope, $state, $rootScope) {
			var vm = this;
		}],
		controllerAs: 'vm'
	};
}]);;'use strict';

angular.module('gujaratSamachar').directive('googleAd', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      html: '='
    },
    link: function link(scope, element, attr) {
      //console.log("scope.html --- : ", scope.html);        
      if (scope.html) {
        return $timeout(function () {
          var adsbygoogle, html, rand;
          rand = Math.random(); //In "rand" var it will generate the random value to google "data-ad-region" which will make sure page got refereshed.
          html = scope.html;
          //html = '<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-9759829929599812" data-ad-slot="2904456688" data-ad-region="page-' + rand + '"></ins>';
          $(element).append(html);
          return (adsbygoogle = window.adsbygoogle || []).push({});
        });
      }
    }
  };
}]);
// http://www.w3tweaks.com/angularjs/google-ads-in-angular-js-app.html;'use strict';

angular.module('gujaratSamachar').directive('bottomAdvertise', ["AdService", "GENERAL_CONFIG", "$stateParams", function (AdService, GENERAL_CONFIG, $stateParams) {
	return {
		restrict: 'EA',
		scope: {
			pageType: '@?'

		},
		templateUrl: 'directives/bottomAdvertise.view.html',
		controller: ["$scope", "$state", "$rootScope", function controller($scope, $state, $rootScope) {
			var vm = this;
			var cleanupArticleCategories;
			var currentState = $state.current.name;
			checkCurrentState(currentState, $stateParams.slug, $stateParams.listType);

			function checkCurrentState(currentState, slug, listType) {
				if (navigator.userAgent.toString().search('Android') >= 0 || navigator.userAgent.toString().search('iPhone') >= 0) {
					$scope.isMobile = true;
				} else {
					$scope.isMobile = false;
				}
				var getParams = {};
				/*Sending today date from client side because of Timezone issue*/
				var today = new Date();
				var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
				var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
				getParams['startDate'] = startDate;
				getParams['endDate'] = endDate;
				if (currentState == 'root.mainSidebar.home') {
					getParams['pageType'] = $scope.pageType;
					getParams['slug'] = '';
				}
				if (currentState == 'root.mainSidebar.articleList') {
					if (listType == 'city') {
						getParams['citySlug'] = slug;
						getParams['pageType'] = $scope.pageType;
					} else {
						getParams['slug'] = slug;
						getParams['pageType'] = '';
					}
				}
				if (currentState == 'root.mainSidebar.articleByMagazine') {
					getParams['pageType'] = $scope.pageType;
					getParams['magazineSlug'] = slug;
				}
				if (currentState == 'root.mainSidebar.photoGallery') {
					getParams['pageType'] = $scope.pageType;
					getParams['slug'] = '';
				}
				if (currentState == 'root.mainSidebar.slideShow' || currentState == 'root.mainSidebar.slideShowDetails') {
					getParams['pageType'] = $scope.pageType;
					getParams['slug'] = '';
				}
				if (currentState == 'root.mainSidebar.videoGalleryList' || currentState == 'root.mainSidebar.videoGalleryDetails') {
					getParams['pageType'] = $scope.pageType;
					getParams['slug'] = '';
				}
				if (currentState == 'root.mainSidebar.articleDetails') {
					cleanupArticleCategories = $rootScope.$on('articleCategories', function (event, categories, isMagazineDetail) {
						if (isMagazineDetail) {
							getParams['pageType'] = 'magazine';
							getParams['magazineSlug'] = categories;
						} else {
							getParams['pageType'] = 'category';
							getParams['slug'] = categories; // MainCategory of article
						}
						getParams['isArticle'] = true;
						getBottomAdvertise(getParams);
						cleanupArticleCategories();
					});
				}
				if (currentState !== 'root.mainSidebar.articleDetails') {
					getBottomAdvertise(getParams);
				}
			}
			function getBottomAdvertise(getParams) {
				AdService.getMainSectionBottomAd().get(getParams, function (response) {
					if (response.data && response.data.length > 0) {
						vm.position = response.data[0].position;
						vm.bottomAd = response.data;
						angular.forEach(vm.bottomAd, function (advertise, index) {
							if (advertise.fileType == 'Image') {
								advertise.imageUrl = GENERAL_CONFIG.image_base_url + '/' + advertise.image;
							}
						});
					} else {
						vm.bottomAd = '';
					}
				});
			}
		}],
		controllerAs: 'vm'
	};
}]);;'use strict';

angular.module('gujaratSamachar').directive('headerAdvertise', function () {
	return {
		restrict: 'EA',
		scope: {
			pageType: '@?'
		},
		templateUrl: 'directives/headerAdvertise.view.html',
		controller: ["$scope", "$rootScope", "$stateParams", "$transitions", "$state", "AdService", "GENERAL_CONFIG", "$timeout", function controller($scope, $rootScope, $stateParams, $transitions, $state, AdService, GENERAL_CONFIG, $timeout) {
			var vm = this;
			var cleanupArticleCategories;
			var pageType = $scope.pageType;
			var currentState = $state.current.name;
			checkCurrentState(currentState, $stateParams.slug, $stateParams.listType);

			function checkCurrentState(currentState, slug, listType) {
				var getParams = {};
				/*Sending today date from client side because of Timezone issue*/
				var today = new Date();
				var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
				var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
				getParams['startDate'] = startDate;
				getParams['endDate'] = endDate;
				if (currentState == 'root.mainSidebar.home') {
					getParams['pageType'] = 'home';
					getParams['slug'] = '';
				}
				if (currentState == 'root.mainSidebar.articleList') {
					if (listType == 'city') {
						getParams['citySlug'] = slug;
						getParams['pageType'] = 'city';
					} else {
						getParams['slug'] = slug;
						getParams['pageType'] = '';
					}
				}
				if (currentState == 'root.mainSidebar.articleByMagazine') {
					getParams['pageType'] = 'magazine';
					getParams['magazineSlug'] = slug;
				}
				if (currentState == 'root.mainSidebar.photoGallery') {
					getParams['pageType'] = 'photo-gallery';
					getParams['slug'] = '';
				}
				if (currentState == 'root.mainSidebar.slideShow' || currentState == 'root.mainSidebar.slideShowDetails') {
					getParams['pageType'] = 'slide-show';
					getParams['slug'] = '';
				}
				if (currentState == 'root.mainSidebar.videoGalleryList' || currentState == 'root.mainSidebar.videoGalleryDetails') {
					getParams['pageType'] = 'video-gallery';
					getParams['slug'] = '';
				}
				if (currentState == 'root.mainSidebar.articleDetails') {
					cleanupArticleCategories = $rootScope.$on('articleCategories', function (event, categories, isMagazineDetail) {
						if (isMagazineDetail) {
							getParams['pageType'] = 'magazine';
							getParams['magazineSlug'] = categories;
						} else {
							getParams['pageType'] = 'category';
							getParams['slug'] = categories; // MainCategory of article
						}
						getParams['isArticle'] = true;
						getHeaderAdvertise(getParams);
						cleanupArticleCategories(); // this will deregister 'articleCategories' listener to prevent memory leak
					});
				}
				if (currentState !== 'root.mainSidebar.articleDetails') {
					getHeaderAdvertise(getParams);
				}
			}

			function getHeaderAdvertise(getParams) {
				AdService.getHeaderAd().get(getParams, function (response) {
					if (response.data && response.data.length > 0) {
						vm.headerAd = response.data[0];
						if (vm.headerAd.fileType == 'Image') {
							if (vm.headerAd.image1) vm.headerAd.image1Url = GENERAL_CONFIG.image_base_url + '/' + vm.headerAd.image1;
							if (vm.headerAd.image2) vm.headerAd.image2Url = GENERAL_CONFIG.image_base_url + '/' + vm.headerAd.image2;
						}
					} else {
						vm.headerAd = '';
					}
				});
			}

			$transitions.onSuccess({}, function ($transitions) {
				currentState = $state.current.name;
				var pageCatSlug = $transitions.params().slug;
				var listType = $transitions.params().listType;
				checkCurrentState(currentState, pageCatSlug, listType);
			});
		}],
		controllerAs: 'vm'
	};
});;'use strict';

/* Directive for missing file path */
angular.module('gujaratSamachar').directive('errSrc', function () {
  return {
    link: function link(scope, element, attrs) {
      element.bind('error', function () {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  };
});;'use strict';

angular.module('gujaratSamachar.main').directive('jsonld', ['$filter', '$sce', function ($filter, $sce) {
    return {
        restrict: 'E',
        template: function template() {
            return '<script type="application/ld+json" ng-bind-html="onGetJson()"></script>';
        },
        scope: {
            json: '=json'
        },
        link: function link(scope, element, attrs) {
            scope.onGetJson = function () {
                return $sce.trustAsHtml($filter('json')(scope.json));
            };
        },
        replace: true
    };
}]);;'use strict';

angular.module('gujaratSamachar').directive("whenScrolled", ["$window", function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, elem, attrs) {
            var raw = elem[0];
            var checkBounds = function checkBounds(evt) {
                var rectObject = raw.getBoundingClientRect();
                if ($window.innerHeight > rectObject.bottom + 100) {
                    scope.loading = true;
                    scope.$apply(attrs.whenScrolled);
                }
            };
            angular.element($window).bind('scroll load', checkBounds);
        }
    };
}]);;'use strict';

angular.module('gujaratSamachar').component('galleryBox', {
  bindings: {},
  templateUrl: 'component/gallery-slider-box/gallery-slider-box.html',
  controller: gallerySlideBoxController,
  controllerAs: 'vm'

});;'use strict';

angular.module('gujaratSamachar').component('newsBox', {
  bindings: {
    categoryBlockData: '@',
    detailArticleUrl: '<',
    articlesLoaded: '<',
    key: '@'
  },
  templateUrl: 'component/news-box/news-box.html',
  controller: newsBoxController,
  controllerAs: 'vm'

});;'use strict';

angular.module('gujaratSamachar').component('storyBox', {
  bindings: {},
  templateUrl: 'component/story-box/story-box.html',
  controller: storyBoxController,
  controllerAs: 'vm'

});;'use strict';

angular.module('gujaratSamachar').component('magazineBox', {
	bindings: {},
	templateUrl: 'component/magazine-box/magazine-box.html',
	controller: magazineBoxController,
	controllerAs: 'vm'
});;"use strict";

angular.module('gujaratSamachar').filter("imagePathFilter", imagePathFilter).filter("arrayChunk", arrayChunk).filter('unsafe', unsafe);

/* Filter articleImage path based on image_base_url */
function imagePathFilter(GENERAL_CONFIG, $state) {
	return function (articles, imageType) {
		if (articles.length > 0) {
			if (imageType == 'thumbImage') {
				articles.map(function (article) {
					if (article.articleImage) {
						article.baseUrl = GENERAL_CONFIG.article_thumb_images_base_url;
					} else if (article.slideShowImages || article.image) {
						if ($state.current.url == '/' || $state.current.name == 'root.mainSidebar.slideShow' || $state.current.name == 'root.mainSidebar.photoGallery') article.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show/thumbnails';else article.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show'; //baseUrl for new admin panel articles
					} else {
						article.baseUrl = GENERAL_CONFIG.image_base_url;
					}
					return article;
				});
			} else {
				articles.map(function (article) {
					if (article.articleImage) {
						article.baseUrl = GENERAL_CONFIG.article_images_base_url;
					} else if (article.slideShowImages || article.image) {
						if ($state.current.url == '/' || $state.current.name == 'root.mainSidebar.slideShow' || $state.current.name == 'root.mainSidebar.photoGallery') article.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show/thumbnails';else article.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show'; //baseUrl for new admin panel articles
					} else {
						article.baseUrl = GENERAL_CONFIG.image_base_url;
					}
					return article;
				});
			}
			return articles;
		} else {
			return articles;
		}
	};
}

/* split array in to chunk of array */
function arrayChunk(GENERAL_CONFIG) {
	return function (array, size) {
		var newArray = [];
		for (var i = 0; i < array.length; i += size) {
			newArray.push(array.slice(i, i + size));
		}
		return newArray;
	};
}

function unsafe($sce) {
	return $sce.trustAsHtml;
};'use strict';

angular.module('gujaratSamachar').controller('HeaderController', HeaderController);

HeaderController.$inject = ['$log', 'mainService', '$q', '$filter', '$timeout', '$state', 'moment', 'megazineDataService', 'cityDataService', 'sectionFlagDataService', '$transitions', '$stateParams', '$location'];

function HeaderController($log, mainService, $q, $filter, $timeout, $state, moment, megazineDataService, cityDataService, sectionFlagDataService, $transitions, $stateParams, $location) {
    var vm = this;
    var sectionFlags;
    var Id = parseInt($stateParams.Id);
    var slug = $stateParams.slug;
    vm.currentState;
    var magazines;
    var gujaratCitites;
    vm.currentDate = moment().format('Do MMMM YYYY'); // September 23rd 2017, 5:13:46 pm
    vm.currentTime = moment().format('LT'); // 5:15 PM
    vm.isNavCollapsed = true;
    vm.currentState = $state.current.name;
    vm.closeMenu = closeMenu;
    magazines = [{ "name": "Ravi Purti", "slug": "ravi-purti" }, { "name": "Business Plus", "slug": "business-plus" }, { "name": "Sahiyar", "slug": "sahiyar" }, { "name": "Shatdal", "slug": "shatdal" }, { "name": "Dharmlok", "slug": "dharmlok" }, { "name": "Chitralok", "slug": "chitralok" }, { "name": "Zagmag", "slug": "zagmag" }, { "name": "Gujarat Samachar Plus", "slug": "gujarat-samachar-plus" }];
    vm.magazine = ['ravi-purti', 'business-plus', 'sahiyar', 'shatdal', 'dharmlok', 'chitralok', 'zagmag', 'gujarat-samachar-plus'];
    if ($state.current.name == 'root.mainSidebar.articleDetails') {
        var currentMagazine = magazines.filter(function (magazine) {
            return magazine.slug == $state.params.categorySlug;
        });
        if (vm.magazine.includes($state.params.categorySlug) == true && currentMagazine[0].name !== 'Gujarat Samachar Plus') {
            vm.logo = 'assets/images/magazine-logo/' + currentMagazine[0].name + '.png';
            vm.activeTab = 'Magazines';
        } else {
            vm.logo = 'assets/images/logo.png';
            vm.activeTab = $state.params.categorySlug;
        }
    } else {
        vm.logo = 'assets/images/logo.png';
        vm.activeTab = $state.params.slug;
    }
    vm.isCity = $state.params.listType;
    if ($state.current.name !== 'root.mainSidebar.articleByMagazine' && $state.current.name != 'root.mainSidebar.articleDetails' && $stateParams.listType !== 'city') {
        vm.logo = 'assets/images/logo.png';
    }
    if ($state.current.name == 'root.mainSidebar.articleList' && $stateParams.listType == 'city') {
        vm.currentState = 'city';
        vm.activeTab = 'City News';
    }
    if ($state.current.name == 'root.mainSidebar.articleByMagazine' && $stateParams.listType !== 'city') {
        vm.activeTab = 'Magazines';
    }
    sectionFlagDataService.sectionFlags().then(function (response) {
        sectionFlags = response;
        var promises = {
            getMenuList: mainService.getMenuList().get({ sortBy: 'position', isMobile: false }).$promise
        };
        vm.tickerShow = false;
        vm.goToDetail = goToDetail;

        $q.all(promises).then(function (responses) {
            if (responses.getMenuList.data) {
                var getMenuList = responses.getMenuList.data;
                vm.menuList = getMenuList;
                var menuCharLength = 0;
                /* Show Main menu based on character count */
                angular.forEach(getMenuList, function (menuItem, index) {
                    menuCharLength += menuItem.name.length;
                    if (menuCharLength <= 67) {
                        // This will exclude char count of City News, Magazines and ePaper
                        if (menuItem.submenu) {
                            angular.forEach(menuItem.submenu, function (subMenuItem, index) {
                                if ($stateParams.slug == subMenuItem.slug || $stateParams.categorySlug == subMenuItem.slug) vm.activeTab = menuItem.slug;
                            });
                        }
                        getMenuList = responses.getMenuList.data.slice(0, index + 1);
                        vm.moreCategories = responses.getMenuList.data.slice(index + 1);
                    } else {}
                });
                angular.forEach(vm.moreCategories, function (menuItem, index) {
                    if ($stateParams.slug == menuItem.slug || $stateParams.categorySlug == menuItem.slug) vm.activeTab = 'More';
                });

                /* First 2 menu (Home, City News) and 2nd last menu(Magazines) will be static */
                var cityNews = {
                    name: "City News",
                    parentId: 0,
                    position: 2,
                    type: "article",
                    state: 'city'
                    /*Magazines will be static, its have rare chance to change so, No need to call API for this*/
                };var currentMagazine = [{ "name": "Ravi Purti", "slug": "ravi-purti" }, { "name": "Business Plus", "slug": "business-plus" }, { "name": "Sahiyar", "slug": "sahiyar" }, { "name": "Shatdal", "slug": "shatdal" }, { "name": "Dharmlok", "slug": "dharmlok" }, { "name": "Chitralok", "slug": "chitralok" }, { "name": "Zagmag", "slug": "zagmag" }, { "name": "Gujarat Samachar Plus", "slug": "gujarat-samachar-plus" }];
                vm.getMenuList = angular.copy(getMenuList);
                vm.getMenuList.splice(0, 0, cityNews); // Add static menu item for City News(Gujarat)
                var magazinePosition = vm.getMenuList.length - 1;
                var magazineNews = {
                    name: "Magazines",
                    parentId: 0,
                    position: magazinePosition,
                    type: "article",
                    submenu: currentMagazine,
                    state: 'root.mainSidebar.articleByMagazine'
                };
                vm.getMenuList.splice(magazinePosition, 0, magazineNews); // Add static menu item for Magazine News

                vm.getMenuList.forEach(function (value) {
                    if (value.name == "City News") {
                        /*Cities will be static, its have rare chance to change so, No need to call API for this*/
                        var cityArray = [{ "_id": "5993f7195b03ab694185b008", "name": "Ahmedabad", "position": 1, "slug": "ahmedabad", "Id": 4 }, { "_id": "5993f7355b03ab694185b01a", "name": "Baroda", "position": 2, "slug": "baroda", "Id": 7 }, { "_id": "5993f7415b03ab694185b022", "name": "Surat", "position": 3, "slug": "surat", "Id": 8 }, { "_id": "5993f70f5b03ab694185b000", "name": "Rajkot", "position": 4, "slug": "rajkot", "Id": 3 }, { "_id": "5993f7255b03ab694185b010", "name": "Bhavnagar", "position": 5, "slug": "bhavnagar", "Id": 5 }, { "_id": "5993f6d95b03ab694185afdf", "name": "Bhuj", "position": 6, "slug": "bhuj", "Id": 1 }, { "_id": "5993f72e5b03ab694185b014", "name": "Kheda-Anand", "position": 7, "slug": "kheda-anand", "Id": 6 }, { "_id": "59b23fd351851cfd2c4d339a", "name": "Gandhinagar", "position": 8, "slug": "gandhinagar", "Id": 9 }, { "_id": "5993f7095b03ab694185affa", "name": "North Gujarat", "position": 9, "slug": "north-gujarat", "Id": 2 }];
                        gujaratCitites = cityArray;
                        value.submenu = cityArray;
                        vm.loadMenu = true;
                    }
                });
            }
        });
    });

    function goToDetail(categorySlug, newsId, articleUrl) {
        $state.go('root.mainSidebar.articleDetails', { categorySlug: categorySlug, articleId: newsId, articleUrl: articleUrl });
    }

    /* Change Logo image based on Selected page type : magaine / city / list */
    $transitions.onSuccess({}, function ($transitions) {
        vm.currentState = $state.current.name;
        if (vm.currentState == 'root.mainSidebar.articleByMagazine') {
            vm.activeTab = 'Magazines';
            if (magazines && magazines.length > 0) {
                var _currentMagazine = magazines.filter(function (magazine) {
                    return magazine.slug == $transitions.params().slug;
                });
                if (_currentMagazine[0].name !== 'Gujarat Samachar Plus') vm.logo = 'assets/images/magazine-logo/' + _currentMagazine[0].name + '.png';else vm.logo = 'assets/images/logo.png';
            }
        } else if ($state.current.name == 'root.mainSidebar.articleList' && $transitions.params().listType == 'city') {
            if (gujaratCitites && gujaratCitites.length > 0) {
                vm.currentState = 'city';
                if (vm.currentState == 'city') {
                    var currentCity = gujaratCitites.filter(function (city) {
                        return city.slug == $transitions.params().slug;
                    });
                    vm.activeTab = 'City News';
                    vm.logo = 'assets/images/city-logo/' + currentCity[0].name + '.png';
                }
            }
        } else if ($state.current.name == 'root.mainSidebar.articleDetails') {
            var _currentMagazine2 = magazines.filter(function (magazine) {
                return magazine.slug == $transitions.params().categorySlug;
            });
            if (vm.magazine.includes($transitions.params().categorySlug) == true && _currentMagazine2[0].name !== 'Gujarat Samachar Plus') {
                vm.logo = 'assets/images/magazine-logo/' + _currentMagazine2[0].name + '.png';
                vm.activeTab = 'Magazines';
            } else {
                vm.activeTab = $transitions.params().categorySlug;
                vm.logo = 'assets/images/logo.png';
            }
        } else {
            vm.activeTab = $transitions.params().slug;
            vm.logo = 'assets/images/logo.png';
        }
        angular.forEach(vm.moreCategories, function (menuItem, index) {
            if ($transitions.params().slug == menuItem.slug || $transitions.params().categorySlug == menuItem.slug) vm.activeTab = 'More';
        });
        angular.forEach(vm.menuList, function (menuItem, index) {
            if (menuItem.submenu) {
                angular.forEach(menuItem.submenu, function (subMenuItem, index) {
                    if ($transitions.params().slug == subMenuItem.slug || $transitions.params().categorySlug == subMenuItem.slug) vm.activeTab = menuItem.slug;
                });
            }
        });
    });

    function closeMenu() {
        vm.isNavCollapsed = true;
    }

    /*=============== NavSearch ===============*/

    // flag : says "remove class when click reaches background"
};'use strict';

angular.module('gujaratSamachar').controller('FooterController', FooterController);

FooterController.$inject = ['$timeout', '$cookies', '$state', 'GENERAL_CONFIG', 'categoryDataService', 'megazineDataService', 'cityDataService', 'mainService', 'StaticPageService'];

function FooterController($timeout, $cookies, $state, GENERAL_CONFIG, categoryDataService, megazineDataService, cityDataService, mainService, StaticPageService) {
    var vm = this;
    if (navigator.userAgent.toString().search('Android') >= 0 || navigator.userAgent.toString().search('iPhone') >= 0 || navigator.userAgent.toString().search('iPad') >= 0 || navigator.userAgent.toString().search('webOS') >= 0 || navigator.userAgent.toString().search('iPod') >= 0) {
        var downloadApplink = $cookies.get('downloadApplink');
        if (downloadApplink && downloadApplink != '') {
            vm.showLink = false;
        } else {
            vm.showLink = true;
        }
    } else {
        vm.showLink = false;
    }
    vm.openDeepLink = openDeepLink;
    vm.closeDeeplink = closeDeeplink;
    vm.doSubscribe = doSubscribe;
    getMagazineData();
    getMainCategories();
    getCityData();
    getVaividhyaLinks();
    getCurrentDateYear();

    function getCurrentDateYear() {
        vm.currentDateYear = new Date().getFullYear();
    }

    function getMainCategories() {
        categoryDataService.getMainCategories().then(function (response) {
            vm.mainCategories = response;
        });
    }

    function getMagazineData() {
        megazineDataService.getMagazineData().then(function (response) {
            vm.magazines = response.documents;
        });
    }

    function getCityData() {
        cityDataService.getCityData().then(function (response) {
            vm.cities = response.documents;
        });
    }

    function getVaividhyaLinks() {
        mainService.getSubCategories().get({
            name: "Editorial",
            type: 'article'
        }, function (response) {
            vm.vaividhyaLinks = response.data;
        });
    }

    function openDeepLink() {
        vm.magazineSlug = ['ravi-purti', 'business-plus', 'sahiyar', 'shatdal', 'dharmlok', 'chitralok', 'zagmag', 'gujarat-samachar-plus'];
        vm.citySlug = ['bhuj', 'north-gujarat', 'rajkot', 'ahmedabad', 'bhavnagar', 'kheda-anand', 'baroda', 'surat', 'gandhinagar'];
        var url = '';
        var slug = '';
        var isMagazine = '';
        var type = '';
        if ($state.params && $state.params.articleUrl && $state.params.categorySlug) {
            url = $state.params.articleUrl;
            slug = $state.params.categorySlug;
            if (vm.magazineSlug.includes(slug) == true) {
                isMagazine = true;
            } else if (vm.citySlug.includes(slug) == true) {
                type = 'city';
                isMagazine = false;
            } else {
                isMagazine = false;
                type = 'category';
            }
        }
        console.log(slug);
        console.log(isMagazine);
        var options = {
            fallback: GENERAL_CONFIG.app_base_url,
            url: 'mygujaratsamachar://categorySlug=' + slug + '&articleUrl=' + url + '&isMagazine=' + isMagazine + '&type=' + type,
            ios_store_link: 'https://itunes.apple.com/in/app/gujarat-samachar-news/id623725053?mt=8',
            android_package_name: 'com.gujaratsamachar'
        };
        /*set cookie for show only one time deeplink/download app model*/
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        $cookies.put('downloadApplink', 'true', {
            'expires': expireDate
        });
        vm.showLink = false;
        deeplink.deepone(options);
    }

    function closeDeeplink() {
        /*set cookie for show only one time deeplink/download app model*/
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        $cookies.put('downloadApplink', 'true', {
            'expires': expireDate
        });
        vm.showLink = false;
    }

    function doSubscribe(isValid) {
        if (isValid) {
            StaticPageService.addSubscribeEmail().get({ emailId: vm.emailId }, function (response) {
                if (response.code == 400) {
                    $('#errorMsg').fadeIn('slow');
                    $timeout(function () {
                        $('#errorMsg').fadeOut('slow');
                    }, 2500);
                } else {
                    $('#successMsg').fadeIn('slow');
                    $timeout(function () {
                        $('#successMsg').fadeOut('slow');
                    }, 2500);
                    vm.emailId = '';
                }
            });
        }
    }
};'use strict';

angular.module('gujaratSamachar.main').controller('TopReadNewsController', TopReadNewsController);

TopReadNewsController.$inject = ['$transitions', '$state', '$log', 'mainService', '$scope', '$q', '$filter', '$timeout', 'sectionFlagDataService'];

function TopReadNewsController($transitions, $state, $log, mainService, $scope, $q, $filter, $timeout, sectionFlagDataService) {
    var vm = this;
    var sectionFlags;
    vm.currentState = $state.current.name;
    vm.topReadNews = [];
    vm.topReadNewsSlider = {
        method: {},
        autoplay: true,
        initialSlide: 3,
        infinite: true,
        arrows: false,
        dots: false,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    };
    getTopReadNews();

    function getTopReadNews() {
        sectionFlagDataService.sectionFlags().then(function (response) {
            sectionFlags = response;
            mainService.stories().get({ sectionId: sectionFlags.topReadNews._id, type: sectionFlags.topReadNews.value }, function (response) {
                vm.topReadNewsSliderLoaded = true;
                vm.topReadNews = response.data;
                if (vm.topReadNews.length > 0) {
                    vm.topReadNews = $filter('imagePathFilter')(vm.topReadNews, 'thumbImage');
                }
                vm.topReadNews = vm.topReadNews.map(function (topReadNews) {
                    if (!topReadNews.categorySlug) topReadNews.slug = topReadNews.magazineSlug;else topReadNews.slug = topReadNews.categorySlug;
                    return topReadNews;
                });
            });
        });
    }

    $transitions.onSuccess({}, function ($transitions) {
        vm.currentState = $state.current.name;
    });
};'use strict';

angular.module('gujaratSamachar.main').controller('RecentPostController', RacentPostController);

RacentPostController.$inject = ['$timeout', '$state', '$transitions', '$stateParams', 'mainService', '$filter', 'sectionFlagDataService', '$q'];

function RacentPostController($timeout, $state, $transitions, $stateParams, mainService, $filter, sectionFlagDataService, $q) {
    var vm = this;
    getRecentNews();
    var currentState = $state.current.name;
    var sectionFlags;
    vm.currentState = $state.current.name;

    vm.articleUrl = $stateParams.articleUrl;
    function getRecentNews() {
        sectionFlagDataService.sectionFlags().then(function (response) {
            sectionFlags = response;
            mainService.stories().get({ sectionId: sectionFlags.recentNews._id, type: sectionFlags.recentNews.value }, function (response) {
                vm.recentPostSliderLoaded = true;
                vm.recentPost = response.data;
                if (vm.recentPost.length > 0) {
                    vm.recentPost = $filter('imagePathFilter')(vm.recentPost, 'thumbImage');
                }
                vm.recentPost = vm.recentPost.map(function (recentPost) {
                    if (!recentPost.categorySlug) recentPost.slug = recentPost.magazineSlug;else recentPost.slug = recentPost.categorySlug;
                    return recentPost;
                });
            });
        });
    }

    $transitions.onSuccess({}, function ($transitions) {
        currentState = $state.current.name;
        vm.currentState = currentState;
        if ($transitions.params().articleUrl) vm.articleUrl = $transitions.params().articleUrl;
    });
};'use strict';

angular.module('gujaratSamachar').controller('MainSidebarController', MainSidebarController);

MainSidebarController.$inject = ['megazineDataService', '$log', 'AdService', '$q', '$filter', '$state', 'GENERAL_CONFIG', '$transitions', '$stateParams', 'shareData', '$scope', 'mainService', '$rootScope', '$timeout'];

function MainSidebarController(megazineDataService, $log, AdService, $q, $filter, $state, GENERAL_CONFIG, $transitions, $stateParams, shareData, $scope, mainService, $rootScope, $timeout) {
    var vm = this;
    var Id;
    vm.articlesLoaded = false;

    vm.currentSlug = $stateParams.slug;
    var currentState = $state.current.name;
    vm.currentState = $state.current.name;
    var cleanupArticleCategories, cleanupArticleMetaTags;
    var articleUrl;
    if ($stateParams.articleUrl) articleUrl = $stateParams.articleUrl;

    vm.articleUrl = $stateParams.articleUrl;
    vm.pollManagerConfig = {
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
                dots: false
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }],
        method: {},
        event: {
            beforeChange: function beforeChange(event, slick, currentSlide, nextSlide) {},
            afterChange: function afterChange(event, slick, currentSlide, nextSlide) {
                $scope.slickCurrentIndex = currentSlide;
            }
        }
    };

    $timeout(function () {
        vm.pollManagerLoaded = true;
    }, 10);

    getMagazineList();

    checkCurrentState(currentState, $stateParams.slug, $stateParams.listType);

    function checkCurrentState(currentState, slug, listType) {
        var getParams = {};
        /*Sending today date from client side because of Timezone issue*/
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        getParams['startDate'] = startDate;
        getParams['endDate'] = endDate;
        if (currentState == 'root.mainSidebar.home') {
            getParams['pageType'] = 'home';
            getParams['slug'] = '';
        }
        if (currentState == 'root.mainSidebar.articleList') {
            if (listType == 'city') {
                getParams['citySlug'] = slug;
                getParams['pageType'] = 'city';
            } else {
                getParams['slug'] = slug;
                getParams['pageType'] = '';
            }
        }
        if (currentState == 'root.mainSidebar.articleByMagazine') {
            getParams['pageType'] = 'magazine';
            getParams['magazineSlug'] = slug;
        }
        if (currentState == 'root.mainSidebar.photoGallery') {
            getParams['pageType'] = 'photo-gallery';
            getParams['slug'] = '';
        }
        if (currentState == 'root.mainSidebar.slideShow' || currentState == 'root.mainSidebar.slideShowDetails') {
            getParams['pageType'] = 'slide-show';
            getParams['slug'] = '';
        }
        if (currentState == 'root.mainSidebar.videoGalleryList' || currentState == 'root.mainSidebar.videoGalleryDetails') {
            getParams['pageType'] = 'video-gallery';
            getParams['slug'] = '';
        }
        if (currentState == 'root.mainSidebar.articleDetails') {
            cleanupArticleCategories = $rootScope.$on('articleCategories', function (event, categories) {
                getParams['pageType'] = 'category';
                getParams['isArticle'] = true;
                getParams['slug'] = categories; // MainCategory of article
                getRightPanelAds(getParams);
                if ($rootScope.isMobile) {
                    getMobileAdvertise(getParams);
                }
                cleanupArticleCategories();
            });
            cleanupArticleMetaTags = $scope.$on('articleMetaTags', function (event, metaTags) {
                var metaTagArr = [];
                metaTagArr = metaTags;
                mainService.getMetaTagList().get({ metaTag: JSON.stringify(metaTagArr), type: 'related-news' }, function (response) {
                    if (response.data !== undefined && response.data.documents !== undefined && response.data.documents.length > 0) {
                        vm.relatedNews = response.data.documents;
                        vm.relatedNews = $filter('imagePathFilter')(vm.relatedNews, 'thumbImage');
                        vm.relatedNews = vm.relatedNews.filter(function (relatedNews) {
                            if (!relatedNews.categorySlug) relatedNews.slug = relatedNews.magazineSlug;else relatedNews.slug = relatedNews.categorySlug;
                            //return relatedNews.articleId != articleId;
                            return relatedNews;
                        });
                        vm.articlesLoaded = true;
                    } else {
                        vm.relatedNews = [];
                    }

                    vm.relatedNewsLoaded = true;
                    cleanupArticleMetaTags(); // this will deregister 'articleMetaTags' listener
                });
            });
        }
        if (currentState !== 'root.mainSidebar.articleDetails') {
            if ($rootScope.isMobile) {
                getMobileAdvertise(getParams);
            }
            getRightPanelAds(getParams);
        }
    }

    function getRightPanelAds(getParams) {
        var adRightTopParam = angular.copy(getParams);
        var adRightMiddleParam = angular.copy(getParams);
        var adRightBottomParam = angular.copy(getParams);
        adRightTopParam['position'] = 'Right 1';
        adRightMiddleParam['position'] = 'Right 2';
        adRightBottomParam['position'] = 'Right 3';
        var promises = {
            adRightTop: AdService.getRightPanelAd().get(adRightTopParam).$promise,
            adRightMiddle: AdService.getRightPanelAd().get(adRightMiddleParam).$promise,
            adRightBottom: AdService.getRightPanelAd().get(adRightBottomParam).$promise
        };
        $q.all(promises).then(function (responses) {
            if (responses.adRightTop.data && responses.adRightTop.data.length > 0) {
                vm.adRightTop = responses.adRightTop.data[0];
                if (vm.adRightTop.fileType == 'Image') {
                    vm.adRightTop.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.adRightTop.image;
                }
            } else {
                vm.adRightTop = '';
            }
            if (responses.adRightMiddle.data && responses.adRightMiddle.data.length > 0) {
                vm.adRightMiddle = responses.adRightMiddle.data[0];
                if (vm.adRightMiddle.fileType == 'Image') {
                    vm.adRightMiddle.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.adRightMiddle.image;
                }
            } else {
                vm.adRightMiddle = '';
            }
            if (responses.adRightBottom.data && responses.adRightBottom.data.length > 0) {
                vm.adRightBottom = responses.adRightBottom.data[0];
                if (vm.adRightBottom.fileType == 'Image') {
                    vm.adRightBottom.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.adRightBottom.image;
                }
            } else {
                vm.adRightBottom = '';
            }
        });
    }

    function getMagazineList() {
        mainService.magazineList().get({ slug: GENERAL_CONFIG.gsPlusMagazineSlug }, function (response) {
            if (response.data !== undefined && response.data.documents.length > 0) {
                var data = response.data.documents;
                vm.sideBarMagazineList = $filter('imagePathFilter')(data, 'thumbImage');
                vm.slug = GENERAL_CONFIG.gsPlusMagazineSlug;
                vm.sideBarMagazineList = vm.sideBarMagazineList.map(function (sideBarMagazineList) {
                    sideBarMagazineList.slug = GENERAL_CONFIG.gsPlusMagazineSlug;
                    return sideBarMagazineList;
                });
            } else {
                vm.sideBarMagazineList = [];
            }
            vm.magazineListLoaded = true;
        });
    }

    $transitions.onSuccess({}, function ($transitions) {
        vm.adRightTop = [];
        vm.adRightMiddle = [];
        vm.adRightBottom = [];
        currentState = $state.current.name;
        vm.currentState = currentState;
        vm.currentSlug = $transitions.params().slug;
        if ($transitions.params().articleUrl) articleUrl = $transitions.params().articleUrl;
        vm.articleUrl = $transitions.params().articleUrl;
        var pageCatSlug = $transitions.params().slug;
        var listType = $transitions.params().listType;
        checkCurrentState(currentState, pageCatSlug, listType);
        //getMagazineList();
    });
    function getMobileAdvertise(getParams) {
        AdService.getMainSectionMobileAd().get(getParams, function (response) {
            if (response.data && response.data.length > 0) {
                vm.mobileAd = response.data;
                angular.forEach(vm.mobileAd, function (advertise, index) {
                    if (advertise.fileType == 'Image') {
                        advertise.imageUrl = GENERAL_CONFIG.image_base_url + '/' + advertise.image;
                    }
                });
            } else {
                vm.mobileAd = '';
            }
        });
    }
};'use strict';

angular.module('gujaratSamachar').component('rightSideNews', {
  bindings: {
    title: '@',
    data: '<',
    articleUrl: '<',
    articlesLoaded: '@'
  },
  templateUrl: 'component/right-side-news/right-side-news.html',
  controller: rightSideNewsController,
  controllerAs: 'vm'

});