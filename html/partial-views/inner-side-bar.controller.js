(function() {
    'use strict';
    angular.module("gApp").controller('sidebar.controller', ['$scope', function($scope) {
        $scope.slickConfig2Loaded = true;
        $scope.slickConfig2 = {
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
            method: {},
            // event: {
            //     beforeChange: function(event, slick, currentSlide, nextSlide) {
            //         console.log('before change', Math.floor((Math.random() * 10) + 100));
            //     },
            //     afterChange: function(event, slick, currentSlide, nextSlide) {
            //         $scope.slickCurrentIndex = currentSlide;
            //     }
            // }
        };
        $scope.slickConfig4Loaded = true;
        $scope.slickConfig4 = {
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
                    console.log('before change', Math.floor((Math.random() * 10) + 100));
                },
                afterChange: function(event, slick, currentSlide, nextSlide) {
                    $scope.slickCurrentIndex = currentSlide;
                }
            }
        };
    }]);
})();