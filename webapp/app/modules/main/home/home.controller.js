'use strict';
angular.module('gujaratSamachar.main')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$state','$stateParams','$rootScope','$log', 'mainService', '$q', '$filter', 'AdService', 'megazineDataService', 'GENERAL_CONFIG', 'sectionFlagDataService'];

function HomeController($state, $stateParams,$rootScope, $log, mainService, $q, $filter, AdService, megazineDataService, GENERAL_CONFIG, sectionFlagDataService) {
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
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true
                }
            }
        ],
        method: {},
    };

    vm.customPagingFn = customPagingFn;

    function customPagingFn(slick, index) {
        var numebr = index + 1;
        return '<a>' + numebr + '</a>';
    };

    var sectionIds = {};
    vm.showLoader = true
    // sectionFlags : Return Section info(name, _id, value)(Sections: Top Stories, Top Sub-Stories, Top Read News, Latest News) 
    sectionFlagDataService.sectionFlags().then(function(response) {
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
        }
        $q.all(promises).then(function(responses) {
            if (responses.magazines) {
                vm.magazines = responses.magazines.documents;
                vm.magazinesLoaded = true;
            }
            if (responses.middleAd1.data && responses.middleAd1.data.length > 0) {
                vm.middleAd1 = responses.middleAd1.data[0];
                if (vm.middleAd1.fileType == 'Image') {
                    vm.middleAd1.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.middleAd1.image;
                }
            }else{
                vm.middleAd1 = '';
            }
            if (responses.middleAd2.data && responses.middleAd2.data.length > 0) {
                vm.middleAd2 = responses.middleAd2.data[0];
                if (vm.middleAd2.fileType == 'Image') {
                    vm.middleAd2.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.middleAd2.image;
                }
            }else{
                vm.middleAd2 = '';
            }
            if (responses.middleAd4.data && responses.middleAd4.data.length > 0) {
                vm.middleAd4 = responses.middleAd4.data[0];
                if (vm.middleAd4.fileType == 'Image') {
                    vm.middleAd4.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.middleAd4.image;
                }
            }else{
                vm.middleAd4 = '';
            }
        });
    });

    if($rootScope.isMobile){
        var cleanupArticleCategories;
        var currentState = $state.current.name;
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
            getMobileAdvertise(getParams);
        }
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
            ]
        };
        getRecentNews();
        var sectionFlags;
        function getRecentNews() {
            sectionFlagDataService.sectionFlags().then(function(response) {
                sectionFlags = response;
                mainService.stories().get({ sectionId: sectionFlags.recentNews._id, type: sectionFlags.recentNews.value}, function(response) {
                    vm.recentPostSliderLoaded = true;
                    vm.recentPost = response.data;
                    if (vm.recentPost.length > 0) {
                        vm.recentPost = $filter('imagePathFilter')(vm.recentPost,'thumbImage');
                    }
                    vm.recentPost = vm.recentPost.map(function(recentPost){
                        if(!recentPost.categorySlug)
                            recentPost.slug = recentPost.magazineSlug;
                        else
                            recentPost.slug = recentPost.categorySlug;
                        return recentPost;
                    })
                });
            });
        }
        getTopReadNews();

        function getTopReadNews() {
            sectionFlagDataService.sectionFlags().then(function(response) {
                sectionFlags = response;
                mainService.stories().get({ sectionId: sectionFlags.topReadNews._id, type: sectionFlags.topReadNews.value }, function(response) {
                    vm.topReadNewsSliderLoaded = true;
                    vm.topReadNews = response.data;
                    if (vm.topReadNews.length > 0) {
                        vm.topReadNews = $filter('imagePathFilter')(vm.topReadNews,'thumbImage');
                    }
                    vm.topReadNews = vm.topReadNews.map(function(topReadNews){
                        if(!topReadNews.categorySlug)
                            topReadNews.slug = topReadNews.magazineSlug;
                        else
                            topReadNews.slug = topReadNews.categorySlug;
                        return topReadNews;
                    })
                });
            });
        }

        getMagazineList();
        
        function getMagazineList() {
            mainService.magazineList().get({ slug: GENERAL_CONFIG.gsPlusMagazineSlug }, function(response) {
                if (response.data !== undefined && response.data.documents.length > 0) {
                    var data = response.data.documents;
                    vm.sideBarMagazineList = $filter('imagePathFilter')(data,'thumbImage');
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
    }
}