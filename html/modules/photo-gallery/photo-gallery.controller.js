(function() {
    'use strict';
    angular.module("gApp").controller('photo-gallery.controller', ['$scope', function($scope) {
        $scope.totalItems = 50;
        $scope.currentPage = 4;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.maxSize = 5;
        $scope.bigTotalItems = 175;
        $scope.bigCurrentPage = 1;

        $scope.slickConfig1Loaded = true;
        $scope.slickConfig1 = {
            autoplay: true,
            infinite: true,
            arrows: false,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
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
                    console.log('before change', Math.floor((Math.random() * 10) + 100));
                },
                afterChange: function(event, slick, currentSlide, nextSlide) {
                    $scope.slickCurrentIndex = currentSlide;
                }
            }
        }
        $scope.slickConfig2Loaded = true;
        $scope.slickConfig2 = {
            autoplay: true,
            infinite: true,
            arrows: false,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
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
                    console.log('before change', Math.floor((Math.random() * 10) + 100));
                },
                afterChange: function(event, slick, currentSlide, nextSlide) {
                    $scope.slickCurrentIndex = currentSlide;
                }
            }
        };

    }]);
})();