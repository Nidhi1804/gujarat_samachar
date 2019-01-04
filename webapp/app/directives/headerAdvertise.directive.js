angular.module('gujaratSamachar')
	.directive('headerAdvertise', function () {
		return {
			restrict: 'EA',
			scope: {
				pageType: '@?'
			},
			templateUrl: 'directives/headerAdvertise.view.html',
			controller: function ($scope, $rootScope, $stateParams, $transitions, $state, AdService, GENERAL_CONFIG, $timeout) {
				var vm = this;
				var cleanupArticleCategories;
				var pageType = $scope.pageType;
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
					}
					if (currentState == 'root.mainSidebar.articleList') {
						if (listType == 'city') {
							getParams['citySlug'] = slug;
							getParams['pageType'] = 'city';
						} else {
							getParams['slug'] = slug;
							getParams['pageType'] = '';
						}
					}
					if (currentState == 'root.mainSidebar.articleByMagazine') {
						getParams['pageType'] = 'magazine';
						getParams['magazineSlug'] = slug;
					}
					if (currentState == 'root.mainSidebar.photoGallery') {
						getParams['pageType'] = 'photo-gallery';
						getParams['slug'] = '';
					}
					if (currentState == 'root.mainSidebar.slideShow' || currentState == 'root.mainSidebar.slideShowDetails') {
						getParams['pageType'] = 'slide-show';
						getParams['slug'] = '';
					}
					if (currentState == 'root.mainSidebar.videoGalleryList' || currentState == 'root.mainSidebar.videoGalleryDetails') {
						getParams['pageType'] = 'video-gallery';
						getParams['slug'] = '';
					}
					if (currentState == 'root.mainSidebar.articleDetails') {
						cleanupArticleCategories = $rootScope.$on('articleCategories', function (event, categories, isMagazineDetail) {
							if(isMagazineDetail){
								getParams['pageType'] = 'magazine';
								getParams['magazineSlug'] = categories;
							}else{
								getParams['pageType'] = 'category';
								getParams['slug'] = categories; // MainCategory of article
							}
							getParams['isArticle'] = true;
							getHeaderAdvertise(getParams);
							cleanupArticleCategories(); // this will deregister 'articleCategories' listener to prevent memory leak
						});
					}
					if (currentState !== 'root.mainSidebar.articleDetails') {
						getHeaderAdvertise(getParams);
					}

				}

				function getHeaderAdvertise(getParams) {
					AdService.getHeaderAd().get(getParams, function (response) {
						if (response.data && response.data.length > 0) {
							vm.headerAd = response.data[0];
							if (vm.headerAd.fileType == 'Image') {
								if (vm.headerAd.image1)
									vm.headerAd.image1Url = GENERAL_CONFIG.image_base_url + '/' + vm.headerAd.image1;
								if (vm.headerAd.image2)
									vm.headerAd.image2Url = GENERAL_CONFIG.image_base_url + '/' + vm.headerAd.image2;
							}
						} else {
							vm.headerAd = ''
						}
					})
				}

				$transitions.onSuccess({}, function ($transitions) {
					currentState = $state.current.name;
					var pageCatSlug = $transitions.params().slug;
					var listType = $transitions.params().listType;
					checkCurrentState(currentState, pageCatSlug, listType)
				});

			},
			controllerAs: 'vm'
		};
	});
