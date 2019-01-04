'use strict';
angular.module('gujaratSamachar.main')
    .controller('newsBoxController', newsBoxController);

newsBoxController.$inject = ['$stateParams','$rootScope','AdService','$state','$transitions','$log', 'GENERAL_CONFIG', 'mainService', '$scope', '$q', '$filter', 'categoryDataService'];

function newsBoxController($stateParams,$rootScope,AdService,$state, $transitions,$log, GENERAL_CONFIG, mainService, $scope, $q, $filter, categoryDataService) {
	var vm = this;
	vm.getArticlesByCategory = getArticlesByCategory;
	//getMainCategories();	
    var getParams = {};
	vm.$onInit = function() {
        vm.data = JSON.parse(vm.categoryBlockData);
        vm.key = vm.key;
  	}
    vm.thumbImageUrl = GENERAL_CONFIG.image_base_url + '/articles/articles_thumbs/thumbnails';
    function getArticlesByCategory(category) {
        vm.currentCategory = category;
        vm.showLoader = true;
        var params;
        if($state.current.name == 'root.mainSidebar.articleDetails'){
            params = {
                categoryId: category._id,
                skipArticleUrl: vm.detailArticleUrl
            } 
        }else{
            params = {
                categoryId: category._id
            } 
        }  

        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        getParams['startDate'] = startDate;
        getParams['endDate'] = endDate;
        var adMiddle3Param = angular.copy(getParams);
        adMiddle3Param['position'] = 'Middle3';
        var promises = {
            middleAd3: AdService.getMiddleAd().get(adMiddle3Param).$promise
        }
        $q.all(promises).then(function(responses) {
            if (responses.middleAd3.data && responses.middleAd3.data.length > 0) {
                vm.middleAd3 = responses.middleAd3.data[0];
                if (vm.middleAd3.fileType == 'Image') {
                    vm.middleAd3.imageUrl = GENERAL_CONFIG.image_base_url + '/' + vm.middleAd3.image;
                }
            }else{
                vm.middleAd3 = '';
            }
         
        });    
        /* Article list based on date on page load(Last published article date) */
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
            var keepOngoing = true;
            vm.selectedStory = vm.stories[0];
            vm.showLoader = false;
        });
    }
    if($rootScope.isMobile){
        var cleanupArticleCategories;
        var currentState = $state.current.name;
        checkCurrentState(currentState, $stateParams.slug, $stateParams.listType)

        function checkCurrentState(currentState, slug, listType) {
            var getParams = {};
            /*Sending today date from client side because of Timezone issue*/
            var today = new Date();
            var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            getParams['startDate'] = startDate;
            getParams['endDate'] = endDate;
            if (currentState == 'root.mainSidebar.home') {
                getParams['pageType'] = 'home';
                getParams['slug'] = '';
                getMobileAdvertise(getParams);
            }else{
                cleanupArticleCategories = $rootScope.$on('articleCategories', function(event, categories) {
                    getParams['pageType'] = 'category';
                    getParams['isArticle'] = true;
                    getParams['slug'] = categories; // MainCategory of article
                    getMobileAdvertise(getParams);
                    cleanupArticleCategories();
                });
            }
        }
        function getMobileAdvertise(getParams){
            AdService.getMainSectionMobileAd().get(getParams, function (response) {
                if (response.data && response.data.length > 0 ) {
                    vm.mobileAd = response.data;
                    angular.forEach(vm.mobileAd,function(advertise, index) {
                        if(advertise.fileType == 'Image') {
                            advertise.imageUrl = GENERAL_CONFIG.image_base_url + '/' + advertise.image;
                        }
                    });
                } else {
                    vm.mobileAd = ''
                }
            })
        }
    }
}