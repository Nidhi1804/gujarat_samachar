    'use strict';
angular.module('gujaratSamachar')
    .controller('MainSidebarController', MainSidebarController);

MainSidebarController.$inject = ['megazineDataService','$log', 'AdService', '$q', '$filter', '$state', 'GENERAL_CONFIG', '$transitions', '$stateParams', 'shareData', '$scope', 'mainService', '$rootScope', '$timeout'];

function MainSidebarController(megazineDataService, $log, AdService, $q, $filter, $state, GENERAL_CONFIG, $transitions, $stateParams, shareData, $scope, mainService, $rootScope, $timeout) {
    var vm = this;
    var Id;
    vm.articlesLoaded = false;
    
    vm.currentSlug = $stateParams.slug;
    var currentState = $state.current.name;
    vm.currentState = $state.current.name;
    var cleanupArticleCategories, cleanupArticleMetaTags;
    var articleUrl;
    if($stateParams.articleUrl)
       articleUrl = $stateParams.articleUrl;

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
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
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
        method: {},
        event: {
            beforeChange: function(event, slick, currentSlide, nextSlide) {
            },
            afterChange: function(event, slick, currentSlide, nextSlide) {
                $scope.slickCurrentIndex = currentSlide;
            }
        }
    };
    
    $timeout(function() {
        vm.pollManagerLoaded = true;
    }, 10);

    getMagazineList();

    checkCurrentState(currentState, $stateParams.slug, $stateParams.listType)

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
            cleanupArticleCategories = $rootScope.$on('articleCategories', function(event, categories) {
                getParams['pageType'] = 'category';
                getParams['isArticle'] = true;
                getParams['slug'] = categories; // MainCategory of article
                getRightPanelAds(getParams);
                if($rootScope.isMobile){
                    getMobileAdvertise(getParams);
                }
                cleanupArticleCategories();
            });
            cleanupArticleMetaTags = $scope.$on('articleMetaTags', function(event, metaTags) {
                var metaTagArr = [];
                metaTagArr = metaTags;
                mainService.getMetaTagList().get({ metaTag: JSON.stringify(metaTagArr), type: 'related-news' }, function(response) {
                    if (response.data !== undefined && response.data.documents !== undefined && response.data.documents.length > 0) {
                        vm.relatedNews = response.data.documents;
                        vm.relatedNews = $filter('imagePathFilter')(vm.relatedNews,'thumbImage');
                        vm.relatedNews = vm.relatedNews.filter(function(relatedNews){
                            if(!relatedNews.categorySlug)
                                relatedNews.slug = relatedNews.magazineSlug;
                            else
                                relatedNews.slug = relatedNews.categorySlug;
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
            if($rootScope.isMobile){
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
            adRightBottom: AdService.getRightPanelAd().get(adRightBottomParam).$promise,
        }
        $q.all(promises).then(function(responses) {
            if (responses.adRightTop.data && responses.adRightTop.data.length > 0) {
                vm.adRightTop = responses.adRightTop.data[0];
                if (vm.adRightTop.fileType == 'Image') {
                    vm.adRightTop.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.adRightTop.image;
                }
            } else {
                vm.adRightTop = ''
            }
            if (responses.adRightMiddle.data && responses.adRightMiddle.data.length > 0) {
                vm.adRightMiddle = responses.adRightMiddle.data[0];
                if (vm.adRightMiddle.fileType == 'Image') {
                    vm.adRightMiddle.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.adRightMiddle.image;
                }
            } else {
                vm.adRightMiddle = ''
            }
            if (responses.adRightBottom.data && responses.adRightBottom.data.length > 0) {
                vm.adRightBottom = responses.adRightBottom.data[0];
                if (vm.adRightBottom.fileType == 'Image') {
                    vm.adRightBottom.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.adRightBottom.image;
                }
            } else {
                vm.adRightBottom = ''
            }
        });
    }

    function getMagazineList() {
        mainService.magazineList().get({ slug: GENERAL_CONFIG.gsPlusMagazineSlug }, function(response) {
            if (response.data !== undefined && response.data.documents.length > 0) {
                var data = response.data.documents;
                vm.sideBarMagazineList = $filter('imagePathFilter')(data,'thumbImage');
                vm.slug = GENERAL_CONFIG.gsPlusMagazineSlug;
                vm.sideBarMagazineList = vm.sideBarMagazineList.map(function(sideBarMagazineList){
                    sideBarMagazineList.slug = GENERAL_CONFIG.gsPlusMagazineSlug;
                    return sideBarMagazineList;
                });
            } else {
                vm.sideBarMagazineList = [];
            }
            vm.magazineListLoaded = true
        });
    }

    $transitions.onSuccess({}, function($transitions) {
        vm.adRightTop = [];
        vm.adRightMiddle = [];
        vm.adRightBottom = [];
        currentState = $state.current.name;
        vm.currentState = currentState;
        vm.currentSlug = $transitions.params().slug;
        if($transitions.params().articleUrl)
            articleUrl = $transitions.params().articleUrl;
            vm.articleUrl = $transitions.params().articleUrl;
        var pageCatSlug = $transitions.params().slug;
        var listType = $transitions.params().listType;
        checkCurrentState(currentState, pageCatSlug, listType);
        //getMagazineList();
    });
    function getMobileAdvertise(getParams){
        AdService.getMainSectionMobileAd().get(getParams, function (response) {
            if (response.data && response.data.length > 0 ) {
                vm.mobileAd = response.data;
                angular.forEach(vm.mobileAd,function(advertise, index) {
                    if(advertise.fileType == 'Image') {
                        advertise.imageUrl = GENERAL_CONFIG.image_base_url + '/' + advertise.image;
                    }
                });
            } else {
                vm.mobileAd = ''
            }
        })
    }
  
}