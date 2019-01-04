'use strict';
angular.module('gujaratSamachar.main')
    .controller('ArticlesByCityController', ArticlesByCityController);

ArticlesByCityController.$inject = ['$timeout','$state','$rootScope', '$log', 'GENERAL_CONFIG', 'mainService', '$scope', '$q', '$filter', 'cityDataService'];

function ArticlesByCityController($timeout,$state,$rootScope, $log, GENERAL_CONFIG, mainService, $scope, $q, $filter, cityDataService) {
    var vm = this;
    vm.cities = [];
    vm.thumbImageUrl = GENERAL_CONFIG.image_base_url + '/articles/articles_thumbs/thumbnails';
   // vm.getArticleByCity = getArticleByCity;
    vm.citySliderConfig = {
        method: {},
        dots: false,
        infinite: false,
        // autoplay: true,
        speed: 300,
        //slidesToShow : 6,
        slidesToScroll: 1,
        //focusOnSelect: true,
        centerMode: false,
        variableWidth: true,
        initialSlide: 0,
        arrows: false,
        event: {
            init: function(slider) {
                vm.hidePrevArrow = true;
                $('.article-by-city .slick-track .slick-slide').on('click', function(event) {
                    var currentSlideIndex = $(this).attr("data-slick-index");
                    vm.citySliderConfig.method.slickGoTo(currentSlideIndex);
                    $('.article-by-city .slick-track .slick-slide').removeClass('slick-active');
                    $('.article-by-city .slick-track .slick-slide[data-slick-index=' + currentSlideIndex + ']').addClass('slick-active');
                })
            },
            beforeChange: function(event, slick, currentSlide, nextSlide) {
                $('.article-by-city .slick-track .slick-slide').removeClass('slick-active');
                $('.article-by-city .slick-track .slick-slide[data-slick-index=' + nextSlide + ']').addClass('slick-active');
                $scope.getArticleByCity(vm.cities[nextSlide]);
            },
            afterChange: function(event, slick, currentSlide, nextSlide) {
                vm.slickCurrentIndex = currentSlide;
                if (currentSlide > 0)
                    vm.hidePrevArrow = false;
                else
                    vm.hidePrevArrow = true;
                if (currentSlide == (vm.cities.length - 1))
                    vm.hideNextArrow = true;
                else
                    vm.hideNextArrow = false;
            }
        }
    };
   
    getCities();

    function getCities() {
        cityDataService.getCityData().then(function(response) {
            vm.cities = response.documents;
            vm.sliderLoaded = true;
            vm.currentCity = vm.cities[0];
            $timeout(function(){
                $scope.getArticleByCity(vm.cities[0]);
            },800);
        })
    }


    $scope.getArticleByCity = function(city) {
        vm.showLoader = true;
        vm.currentCity = city;
        var params;
        if($state.current.name == 'root.mainSidebar.articleDetails'){
            params = {
                cityId: city._id,
                skipArticleUrl: $rootScope.detailArticleUrl
            } 
        }else{
            params = {
                cityId: city._id
            } 
        }  
        mainService.stories().get(params, function(response) {
            vm.stories = response.data;
            if (vm.stories.length > 0) {
                vm.stories = $filter('imagePathFilter')(vm.stories);
            }
            vm.stories.forEach(function(story) {
                if (story.metaTag && story.metaTag.length > 0) {
                    var tagArray = [];
                    story.metaTag.forEach(function(tag) {
                        tagArray.push(tag.name);
                    })
                    story.metaTag = JSON.stringify(tagArray);
                }
            });
            vm.articlesLoaded = true;
            vm.showLoader = false;
            vm.selectedStory = vm.stories[0];
        });
    }
}