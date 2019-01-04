angular.module('gsApp', ['ui.bootstrap','slickCarousel',]);

/*=============== Tab ===============*/

angular.module('gsApp').controller('TabsDemoCtrl', function ($scope, $window) {
  $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      $window.alert('You\'ve selected the alert tab!');
    });
  };

  $scope.model = {
    name: 'Tabs'
  };
});

/*=============== Tab ===============*/


/*============= slick =============*/

(function() {
    'use strict';
    angular.module("gsApp").controller('opinionController', ['$scope', function($scope) {
        $scope.slickConfig1Loaded = true;
        $scope.slickConfig1 = {
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

    }]);
})();

/*Main Slider Mobile*/

(function() {
    'use strict';
    angular.module("gsApp").controller('mobileMainSlider', ['$scope', function($scope) {
        $scope.slickConfig1Loaded = true;
        $scope.slickConfig1 = {
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
            // event: {
            //     beforeChange: function(event, slick, currentSlide, nextSlide) {
            //         console.log('before change', Math.floor((Math.random() * 10) + 100));
            //     },
            //     afterChange: function(event, slick, currentSlide, nextSlide) {
            //         $scope.slickCurrentIndex = currentSlide;
            //     }
            // }
        };

    }]);
})();

/*Main Slider Mobile*/

/*Gallery Slider Mobile*/

(function() {
    'use strict';
    angular.module("gsApp").controller('mobileGallerySlider', ['$scope', function($scope) {
        $scope.slickConfig1Loaded = true;
        $scope.slickConfig1 = {
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
                        slidesToScroll: 1,
                        arrows: true,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: true,
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

    }]);
})();

/*Gallery Slider Mobile*/

/*============= slick =============*/ 