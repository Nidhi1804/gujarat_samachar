angular.module('gujaratSamachar')
	.directive('bottomAdvertise',function (AdService, GENERAL_CONFIG, $stateParams){
		return{
			restrict: 'EA',
			scope:{
				pageType:'@?'
				
			},
			templateUrl: 'directives/bottomAdvertise.view.html',
			controller:function($scope, $state, $rootScope){
				var vm = this
				var cleanupArticleCategories;
				var currentState = $state.current.name;
				checkCurrentState(currentState, $stateParams.slug, $stateParams.listType)

			    function checkCurrentState(currentState, slug, listType) {
			    	 if (navigator.userAgent.toString().search('Android') >= 0 || navigator.userAgent.toString().search('iPhone') >= 0) {
			            $scope.isMobile = true;
			        } else {
			            $scope.isMobile = false;
			        }
					var getParams = {};
			        /*Sending today date from client side because of Timezone issue*/
					var today = new Date();
					var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
					var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
					getParams['startDate'] = startDate;
					getParams['endDate'] = endDate;
			        if (currentState == 'root.mainSidebar.home') {
			            getParams['pageType'] = $scope.pageType;
			            getParams['slug'] = '';
			        }
			        if (currentState == 'root.mainSidebar.articleList') {
			            if (listType == 'city') {
			                getParams['citySlug'] = slug;
			                getParams['pageType'] = $scope.pageType;
			            } else {
			                getParams['slug'] = slug;
			                getParams['pageType'] = '';
			            }
			        }
			        if (currentState == 'root.mainSidebar.articleByMagazine') {
			            getParams['pageType'] = $scope.pageType;
			            getParams['magazineSlug'] = slug;
			        }
			        if (currentState == 'root.mainSidebar.photoGallery') {
			            getParams['pageType'] = $scope.pageType;
			            getParams['slug'] = '';
			        }
			        if (currentState == 'root.mainSidebar.slideShow' || currentState == 'root.mainSidebar.slideShowDetails') {
			            getParams['pageType'] = $scope.pageType;
			            getParams['slug'] = '';
			        }
			        if (currentState == 'root.mainSidebar.videoGalleryList' || currentState == 'root.mainSidebar.videoGalleryDetails') {
			            getParams['pageType'] = $scope.pageType;
			            getParams['slug'] = '';
			        }
			        if (currentState == 'root.mainSidebar.articleDetails') {
			            cleanupArticleCategories = $rootScope.$on('articleCategories', function(event, categories, isMagazineDetail) {
			                if(isMagazineDetail){
								getParams['pageType'] = 'magazine';
								getParams['magazineSlug'] = categories;
							}else{
								getParams['pageType'] = 'category';
								getParams['slug'] = categories; // MainCategory of article
							}
			                getParams['isArticle'] = true;
			                getBottomAdvertise(getParams);
			                cleanupArticleCategories();
			            });
			        }
			        if (currentState !== 'root.mainSidebar.articleDetails') {
			            getBottomAdvertise(getParams);
			        }
			    }
				function getBottomAdvertise(getParams){
					AdService.getMainSectionBottomAd().get(getParams, function (response) {
						if (response.data && response.data.length > 0 ) {
							vm.position = response.data[0].position;
							vm.bottomAd = response.data;
							angular.forEach(vm.bottomAd,function(advertise, index) {
								if(advertise.fileType == 'Image') {
									advertise.imageUrl = GENERAL_CONFIG.image_base_url + '/' + advertise.image;
								}
							});
						} else {
							vm.bottomAd = ''
						}
					})
				}
			},
			controllerAs:'vm'
		};
});
