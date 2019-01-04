'use strict';
angular.module('gujaratSamachar.main')
    .controller('VideoGalleryDetailsController', VideoGalleryDetailsController);

VideoGalleryDetailsController.$inject = ['mainService', '$stateParams', '$filter', '$state', '$timeout', '$sce', '$rootScope', 'metaService'];

function VideoGalleryDetailsController(mainService, $stateParams, $filter, $state, $timeout, $sce, $rootScope, metaService) {
    var vm = this;
    let url = $stateParams.url;
    let metaKeywordsString;
    let metaKeywordArr = [];
    vm.getVideoGalleryDetails = getVideoGalleryDetails;
    vm.Id = parseInt($stateParams.Id);
    vm.previousSlide = previousSlide;
    vm.nextSlide = nextSlide;
    vm.videoGalleryConfig = {
        autoplay: true,
        infinite: true,
        arrows: false,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false
                }
            }
        ],
        method: {},
        // event: {
        //     beforeChange: function(event, slick, currentSlide, nextSlide) {
        //         // console.log('before change', Math.floor((Math.random() * 10) + 100));
        //     },
        //     afterChange: function(event, slick, currentSlide, nextSlide) {
        //         $scope.slickCurrentIndex = currentSlide;
        //     }
        // }
    };
    vm.navConfig = {
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.main-slider',
        dots: false,
        arrows: true,
        centerMode: false,
        focusOnSelect: true,
        responsive: [{
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }],
    };

    vm.videoGalleryConfig2 = {
        autoplay: false,
        infinite: true,
        autoplaySpeed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        asNavFor: '.slider-nav',
        method: {},
        event: {
            beforeChange: function(event, slick, currentSlide, nextSlide) {
                var mySlideNumber = nextSlide;
                $('.slider-nav-thumbnails .slick-slide').removeClass('slick-active');
                $('.slider-nav-thumbnails .slick-slide').eq(mySlideNumber).addClass('slick-active');
            },
            afterChange: function(event, slick, currentSlide, nextSlide) {
                $('.content').hide();
                $('.content[data-id=' + (currentSlide) + ']').show();
            }
        }
    };

    function getVideoGalleryDetails() {
        var findObj = {};
        if (vm.Id !== undefined && vm.Id !== "" && vm.Id !== null) {
            findObj['Id'] = vm.Id;
        }
        if (url !== undefined && url !== "" && url !== null) {
            findObj['url'] = url;
        }
        mainService.videoGallery().get(findObj, function(response) {
            if (response.data !== undefined && response.data.videos &&response.data.videos.length > 0) {
                let videoData = response.data.videos[0];
                if (response.data.videos[0].galleryVideos !== undefined && response.data.videos[0].galleryVideos !== null && response.data.videos[0].galleryVideos !== "") {
                    vm.videoGalleryImages = response.data.videos[0].galleryVideos;
                }
                $state.current.data.pageTitle = response.data.videos[0].metaTitle + " - Gujarat Samachar Video Story | ";
                console.log("videoData === ", videoData);
                var videoImage = "https://img.youtube.com/vi/" + vm.videoGalleryImages[0].videoId + "/0.jpg";
                console.log("videoImage :=== ", videoImage);
                if (videoData.metaKeywords !== undefined && videoData.metaKeywords.length > 0) {
                    metaKeywordsString = Object.keys(videoData.metaKeywords).map(function(k) {
                        metaKeywordArr.push(videoData.metaKeywords[k].name);
                        return videoData.metaKeywords[k].name;
                    }).join(", ");
                } else {
                    metaKeywordsString = {};
                }
                $rootScope.metaservice.set(videoData.metaTitle, videoData.metaDescriptions, metaKeywordsString, videoImage);
            } else {
                $state.go("root.404");
            }
            vm.videoGalleryDetailsLoaded = true;
        });
    }
    getVideoGalleryDetails();

    function getVideoGalleryData() {
        var findObj = {};
        vm.videoGalleryLoaded = false;
        mainService.videoGallery().get(findObj, function(response) {
            if (response.data.videos !== undefined && response.data.videos.length > 0) {
                vm.videoGalleries = response.data.videos.splice(0, 8);
            } else {
                vm.videoGalleries = [];
            }
            vm.videoGalleryLoaded = true;
        });
    }
    getVideoGalleryData();

    function previousSlide($event) {
        var prevBtn = angular.element(document.querySelectorAll('#arrowBtn'));
        prevBtn.removeClass('active-arrow');
        angular.element($event.currentTarget).addClass("active-arrow");
        vm.videoGalleryConfig.method.slickPrev()
    }

    function nextSlide($event) {
        var prevBtn = angular.element(document.querySelectorAll('#arrowBtn'));
        prevBtn.removeClass('active-arrow');
        angular.element($event.currentTarget).addClass("active-arrow");
        vm.videoGalleryConfig.method.slickNext()
    }
};