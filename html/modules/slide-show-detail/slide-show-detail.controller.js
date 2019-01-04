(function() {
    'use strict';
    angular.module("gApp").controller('slide-show-detail.controller', ['$scope', function($scope) {
    $scope.navConfig = {
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: '.main-slider',
      dots: false,
      arrows: true,
      centerMode: false,
      focusOnSelect: true,
            responsive: [
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow:2,
                        slidesToScroll: 1
                    }
                }
            ],
    };

    $scope.slickConfig5 = {
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
                  $('.content[data-id=' + (currentSlide + 1) + ']').show();
                }
            }
        };
  
  }]);


})();
