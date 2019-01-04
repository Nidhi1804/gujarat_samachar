'use strict';
angular.module('gujaratSamachar.main')
    .controller('SlideShowDetailsController', SlideShowDetailsController);

SlideShowDetailsController.$inject = ['mainService', '$stateParams', '$filter', '$state', '$timeout', 'GENERAL_CONFIG', '$rootScope', 'metaService'];

function SlideShowDetailsController(mainService, $stateParams, $filter, $state, $timeout, GENERAL_CONFIG, $rootScope, metaService) {
    var vm = this;
    let url = $stateParams.url;
    let metaKeywordsString;
    let metaKeywordArr = [];
    $rootScope.metaservice = metaService;
    vm.getSlideShowDetails = getSlideShowDetails;
    vm.Id = parseInt($stateParams.Id);
    vm.previousSlide = previousSlide;
    vm.nextSlide = nextSlide;
    vm.slideShowConfig = {
        autoplay: true,
        initialSlide: 1,
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

    vm.slideShowConfig2 = {
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

    function getSlideShowDetails() {
        var findObj = {};
        if (vm.Id !== undefined && vm.Id !== "" && vm.Id !== null) {
            findObj['Id'] = vm.Id;
            findObj['url'] = url;
            mainService.slideShowDetails().get(findObj, function(response) {
                if (response.code == 404) {
                    $state.go("root.404");
                } else {
                    var data = response.data;
                    vm.slideShowImages = [];
                    if (data.length > 0) {
                        data.map(function(image) {
                            return $filter('imagePathFilter')(image.slideShowImages);
                        })
                        vm.slideShowImages = data[0].slideShowImages;
                    }
                    $state.current.data.pageTitle = response.data[0].metaTitle + " - Gujarat Samachar Photo Story | ";
                    var sldieshowImage = vm.slideShowImages[0].baseUrl + '/' + vm.slideShowImages[0].image;
                    if (data[0].metaKeywords !== undefined && data[0].metaKeywords.length > 0) {
                        metaKeywordsString = Object.keys(data[0].metaKeywords).map(function(k) {
                            metaKeywordArr.push(data[0].metaKeywords[k].name);
                            return data[0].metaKeywords[k].name;
                        }).join(", ");
                    } else {
                        metaKeywordsString = {};
                    }
                    $rootScope.metaservice.set(data[0].metaTitle, data[0].metaDescriptions, metaKeywordsString, sldieshowImage);
                    vm.slideShowsLoaded = true;
                }
            });
        }
    }
    getSlideShowDetails();

    function getSlideData() {
        var findObj = {};
        vm.slideShowLoaded = false;
        mainService.slideShow().get(findObj, function(response) {
            if (response.data.documents) {
                vm.slideShows = response.data.documents.splice(0, 8);
                if (vm.slideShows.length > 0) {
                    vm.slideShows = $filter('imagePathFilter')(vm.slideShows);
                }
            }
            vm.slideShowLoaded = true;
        })
    }
    getSlideData();

    function previousSlide($event) {
        var prevBtn = angular.element(document.querySelectorAll('#arrowBtn'));
        prevBtn.removeClass('active-arrow');
        angular.element($event.currentTarget).addClass("active-arrow");
        vm.slideShowConfig.method.slickPrev()
    }

    function nextSlide($event) {
        var prevBtn = angular.element(document.querySelectorAll('#arrowBtn'));
        prevBtn.removeClass('active-arrow');
        angular.element($event.currentTarget).addClass("active-arrow");
        vm.slideShowConfig.method.slickNext()
    }
};