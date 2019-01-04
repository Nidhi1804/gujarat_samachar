'use strict';
angular.module('gujaratSamachar.main')
    .controller('TopReadNewsController', TopReadNewsController);

TopReadNewsController.$inject = ['$transitions', '$state', '$log', 'mainService', '$scope', '$q', '$filter', '$timeout', 'sectionFlagDataService'];

function TopReadNewsController($transitions, $state, $log, mainService, $scope, $q, $filter, $timeout, sectionFlagDataService) {
    var vm = this;
    var sectionFlags;
    vm.currentState = $state.current.name;
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

    $transitions.onSuccess({}, function($transitions) {
        vm.currentState = $state.current.name;
    });
}