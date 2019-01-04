'use strict';
angular.module('gujaratSamachar.main')
    .controller('RecentPostController', RacentPostController);

RacentPostController.$inject = ['$timeout','$state', '$transitions', '$stateParams', 'mainService', '$filter','sectionFlagDataService','$q'];

function RacentPostController($timeout, $state, $transitions, $stateParams, mainService, $filter,sectionFlagDataService, $q) {
    var vm = this;
    getRecentNews();
    var currentState = $state.current.name;
    var sectionFlags;
    vm.currentState = $state.current.name;

    vm.articleUrl = $stateParams.articleUrl;
    function getRecentNews() {
        sectionFlagDataService.sectionFlags().then(function(response) {
            sectionFlags = response;
            mainService.stories().get({ sectionId: sectionFlags.recentNews._id, type: sectionFlags.recentNews.value}, function(response) {
                vm.recentPostSliderLoaded = true;
                vm.recentPost = response.data;
                if (vm.recentPost.length > 0) {
                    vm.recentPost = $filter('imagePathFilter')(vm.recentPost,'thumbImage');
                }
                vm.recentPost = vm.recentPost.map(function(recentPost){
                    if(!recentPost.categorySlug)
                        recentPost.slug = recentPost.magazineSlug;
                    else
                        recentPost.slug = recentPost.categorySlug;
                    return recentPost;
                })
            });
        });
    }

    $transitions.onSuccess({}, function($transitions) {
        currentState = $state.current.name;
        vm.currentState = currentState;
        if($transitions.params().articleUrl)
            vm.articleUrl = $transitions.params().articleUrl;
    });
}