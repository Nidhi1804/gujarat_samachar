(function() {
    'use strict';
    angular.module("gApp").controller('home.controller', ['$scope', function($scope) {
        $scope.slickConfig3Loaded = true;
        $scope.slickConfig3 = {
            autoplay: true,
            initialSlide: 3,
            infinite: true,
            arrows: false,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
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
        $scope.customPagingFn = function(slick, index) {
           // console.log("index : --------- 0", index);
            return '<a>' + index + '</a>';
        };
        $scope.slickConfig1Loaded = true;
        $scope.slickConfig1 = {
            method: {},
            dots: false,
            infinite: true,
            autoplay: true,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
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
    $scope.slickConfig5Loaded = true;
    $scope.slickConfig5 = {
      method: {},
      dots: false,
      infinite: true,
      speed: 300,
      slidesToScroll: 1,
      centerMode: false,
      variableWidth: true,
      arrows: false,
    };

    $scope.slickConfig6Loaded = true;
    $scope.slickConfig6 = {
      method: {},
      dots: false,
      infinite: true,
      speed: 300,
      slidesToScroll: 1,
      centerMode: false,
      variableWidth: true,
      arrows: false,
    };

    }]);
})();
