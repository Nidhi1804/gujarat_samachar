(function() {
    'use strict';
    angular
        .module('gujaratSamachar.main', [
            'ui.router',
            'ngResource',
            'gujaratSamachar.config',
            'angularUtils.directives.dirPagination'
        ])
        .config(config)
        .run(run)
    config.$inject = ['GENERAL_CONFIG', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$stateProvider', '$ocLazyLoadProvider'];

    function config(GENERAL_CONFIG, $urlRouterProvider, $locationProvider, $httpProvider, $stateProvider, $ocLazyLoadProvider) {
        //$locationProvider.html5Mode(true).hashPrefix('!');
        $locationProvider.html5Mode({ enabled: true, requireBase: true }).hashPrefix('!');
        $urlRouterProvider.otherwise('/');
        var version = GENERAL_CONFIG.file_version;
        $stateProvider
            .state('root', {
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
            })
            .state('root.404', {
                url: '/404',
                templateUrl: 'partial-views/404.view.html'
            })
            .state('root.mainSidebar', {
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
            })
            .state('root.mainSidebar.home', {
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
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/home/articlesByCity/articlesByCity.controller.js" + version,
                                "modules/main/home/articlesByCategory/articlesByCategory.controller.js" + version,
                                "bower_components/fancybox-plus/css/jquery.fancybox-plus.css" + version,
                                "bower_components/fancybox-plus/dist/jquery.fancybox-plus.js" + version,
                                "bower_components/angular-fancybox-plus/js/angular-fancybox-plus.js" + version,
                                "modules/main/home/breakingNews/breakingNews.controller.js" + version,
                                "directives/imageLoading.directive.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: '' }
            })
            .state('root.mainSidebar.articleDetails', {
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
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/articleDetails/articleDetails.controller.js" + version,
                                "directives/disqusComments.directive.js" + version,
                                "modules/main/home/articlesByCity/articlesByCity.controller.js" + version,
                                "modules/main/home/articlesByCategory/articlesByCategory.controller.js" + version,
                                "bower_components/angular-socialshare/dist/angular-socialshare.min.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: '' }
            })
            .state('root.mainSidebar.articleList', { // Id will be unique for each category
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
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/articleList/articleList.controller.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: '' }
            })
            .state('root.mainSidebar.rss', { 
                url: '/rss',
                views: {
                    '': {
                        templateUrl: 'partial-views/rss.view.html',
                        controller: 'RssController as vm'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "partial-views/rss.controller.js" + version
                            ]
                        });
                    }]
                }
            })
            .state('root.mainSidebar.meta', {
                url: '/tags/:metaTag/:pageIndex?date', //listType : single metaTag list page
                views: {
                    '': {
                        templateUrl: 'modules/main/articleList/articleList.view.html',
                        controller: 'metaController as vm'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/articleList/metaTag/metaTag.controller.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: '' }
            })
            .state('root.mainSidebar.articleByMagazine', {
                url: '/magazine/:slug/:pageIndex?date',
                views: {
                    '': {
                        templateUrl: 'modules/main/magazine/articleByMagazine.view.html',
                        controller: 'articleByMagazine as vm'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/magazine/articleByMagazine.controller.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: '' }
            })
            .state('root.mainSidebar.slideShow', {
                url: '/photo/:pageIndex?date',
                views: {
                    '': {
                        templateUrl: 'modules/main/slideShow/slideShowHome.view.html',
                        controller: 'SlideShowController as vm'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/slideShow/slideShowHome.controller.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: 'Slide Show | ' }
            })
            .state('root.mainSidebar.photoGallery', {
                url: '/gs_photo/:pageIndex',
                views: {
                    '': {
                        templateUrl: 'modules/main/photoGallery/photoGalleryList.view.html',
                        controller: 'PhotoGalleryListController as vm'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/photoGallery/photoGalleryList.controller.js" + version,
                                "bower_components/fancybox-plus/css/jquery.fancybox-plus.css" + version,
                                "bower_components/fancybox-plus/dist/jquery.fancybox-plus.js" + version,
                                "bower_components/angular-fancybox-plus/js/angular-fancybox-plus.js" + version,
                                "directives/windowResize.directive.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: 'Photo Gallery | ' }
            })
            .state('root.mainSidebar.slideShowDetails', {
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
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/slideShow/slideShowDetails.controller.js" + version,
                                "directives/windowResize.directive.js" + version,
                                "modules/main/home/articlesByCity/articlesByCity.controller.js" + version,
                                "modules/main/home/articlesByCategory/articlesByCategory.controller.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: '' }
            })
            .state('root.staticPage', {
                url: '/static-page/:pageType',
                templateUrl: 'partial-views/staticPage/staticPage.view.html',
                controller: 'StaticPageController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load("partial-views/staticPage/staticPage.controller.js" + version);
                    }]
                },
                data: { pageTitle: '' }
            })
            .state('root.sitemap', {
                url: '/sitemap',
                templateUrl: 'modules/main/sitemap/sitemap.view.html',
                controller: 'sitemapController as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load("modules/main/sitemap/sitemap.controller.js" + version);
                    }]
                },
                data: { pageTitle: 'Sitemap | ' }
            })
            .state('root.mainSidebar.videoGalleryList', {
                url: '/video-gallery/list/:pageIndex',
                views: {
                    '': {
                        templateUrl: 'modules/main/videoGallery/videoGalleryList.view.html',
                        controller: 'VideoGalleryListController as vm'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/videoGallery/videoGalleryList.controller.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: 'Video Gallery | ' }
            })
            .state('root.mainSidebar.videoGalleryDetails', {
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
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/videoGallery/videoGalleryDetails.controller.js" + version,
                                "directives/windowResize.directive.js" + version,
                                "modules/main/home/articlesByCity/articlesByCity.controller.js" + version,
                                "modules/main/home/articlesByCategory/articlesByCategory.controller.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: '' }
            })
            .state('root.mainSidebar.metaTagList', {
                url: '/meta-tags/:articleId/:pageIndex?&date&metaTag',
                views: {
                    '': {
                        templateUrl: 'modules/main/metaTag/metaTagList.view.html',
                        controller: 'MetaTagController as vm'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/metaTag/metaTagList.controller.js" + version
                            ]
                        });
                    }]
                }
            })
            .state('root.mainSidebar.topReadNewsList', {
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
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/articleList/topReadNewsList/topReadNewsList.controller.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: 'Top Read News | ' }
            })
            .state('root.mainSidebar.topHeadingNewsList', {
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
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/articleList/topHeadingNewsList/topHeadingNewsList.controller.js" + version
                            ]
                        });
                    }]
                },
                data: { pageTitle: 'Top Head News | ' }
            })
            .state('root.mainSidebar.recentNewsList', {
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
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/articleList/recentNewsList/recentNewsList.controller.js" + version
                            ]
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
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                "modules/main/articleList/sectionPage/sectionPage.controller.js" + version
                            ]
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
        $state.defaultErrorHandler(function() {
            //Default error handler fired!
            $state.go('login');
        });
    };
})();