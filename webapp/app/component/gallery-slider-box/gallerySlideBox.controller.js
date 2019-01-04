'use strict';
angular.module('gujaratSamachar.main')
    .controller('gallerySlideBoxController', gallerySlideBoxController);

gallerySlideBoxController.$inject = ['$timeout','$rootScope','$log', 'mainService', '$q', '$filter', 'AdService', 'megazineDataService', 'GENERAL_CONFIG', 'sectionFlagDataService'];

function gallerySlideBoxController($timeout, $rootScope, $log, mainService, $q, $filter, AdService, megazineDataService, GENERAL_CONFIG, sectionFlagDataService) {
    var vm = this;
    var sectionFlags;
    vm.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show';
    vm.getVideoGalleryData = getVideoGalleryData;
    vm.getSlideData = getSlideData;
    vm.getPhotoGalleryData = getPhotoGalleryData;
    vm.previousSlide = previousSlide;
    vm.nextSlide = nextSlide;
    vm.photoGalleryFancybox = { 'titleShow': true,titlePosition: 'inside' };
    vm.photoGalleryFancyGroup = {
        'transitionIn': 'none',
        'transitionOut': 'none',
        'titlePosition': 'over',
        'titleFormat': function(title, currentArray, currentIndex, currentOpts) {
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
    };
    var sectionIds = {};

    //Tab Click Get Slide-show List
    function getSlideData() {
        var findObj = {location: "home"};
        vm.slideShowLoaded = false;
        vm.showLoader = true;
        mainService.slideShow().get(findObj, function(response) {
            if (response.data.documents) {
                vm.slideShows = response.data.documents.splice(0, 8);
                if (vm.slideShows.length > 0) {
                    vm.slideShows = $filter('imagePathFilter')(vm.slideShows);
                }
                vm.showLoader = false;
            }
            vm.slideShowLoaded = true;
        })
    }

    function getPhotoGalleryData() {
        var findObj = {location: "home"};
        vm.galleryListLoaded = false;
        vm.showLoader = true;
        mainService.getPhotoGalleryList().get(findObj, function(response) {
            vm.galleryList = response.data.slice(0, 8);
            if (vm.galleryList.length > 0) {
                vm.galleryList = $filter('imagePathFilter')(vm.galleryList);
                vm.showLoader = false;
            }
            vm.galleryListLoaded = true;
        })
    }

    function getVideoGalleryData() {
        var findObj = {location: "home"};
        vm.videoGalleryLoaded = false;
        vm.showLoader = true;
        mainService.videoGallery().get(findObj, function(response) {
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
        vm.photoGalleryConfig1.method.slickPrev()
    }

    function nextSlide($event) {
        var prevBtn = angular.element(document.querySelectorAll('#arrowBtn'));
        prevBtn.removeClass('active-arrow');
        angular.element($event.currentTarget).addClass("active-arrow");
        vm.photoGalleryConfig1.method.slickNext()
    }
}