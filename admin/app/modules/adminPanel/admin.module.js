angular
	.module('gujaratSamachar.adminPanel', [
		'ui.router',
		'ngResource',
		'angularUtils.directives.dirPagination'
	])
	.config(config)
	.run(run)
config.$inject = ['$urlRouterProvider', '$locationProvider', '$httpProvider', '$stateProvider', '$ocLazyLoadProvider'];
function config($urlRouterProvider, $locationProvider, $httpProvider, $stateProvider, $ocLazyLoadProvider) {
	//$locationProvider.html5Mode(true).hashPrefix('!');
	$urlRouterProvider.otherwise('/login');
	$stateProvider
		.state('root', {
			abstract: true,
			url: '/admin',
			views: {
				'@': {
					templateUrl: 'partial-views/main.view.html'
				},
				'header@root': {
					templateUrl: 'partial-views/header.view.html',
					controller: 'HeaderController as vm'
				},
				'footer@root': {
					templateUrl: 'partial-views/footer.view.html',
					controller: 'FooterController as vm'
				}
			},
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							"partial-views/header.controller.js",
							"partial-views/footer.controller.js",
							"partial-views/sidebar/sidebar.controller.js",
							"partial-views/confirm-modal/confirmModal.controller.js",
							"bower_components/ckeditor/ckeditor.js",
							"bower_components/angular-ckeditor/angular-ckeditor.min.js",
							"bower_components/ng-tags-input/ng-tags-input.min.css",
							"bower_components/ng-tags-input/ng-tags-input.bootstrap.min.css",
							"bower_components/ng-tags-input/ng-tags-input.min.js"
						]
					}]);
				}],
				isTokenExist: function (AuthService) {
					return AuthService.isTokenExist()
				}
			}
		})
		.state('root.dashboard', {
			url: '/dashboard',
			templateUrl: 'modules/adminPanel/dashboard/dashboard.view.html',
			controller: 'DashboardController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/dashboard/dashboard.controller.js");
				}]
			}
		})
		.state('root.addUser', {
			url: '/user/add',
			templateUrl: 'modules/adminPanel/userManagement/addEditUser.view.html',
			controller: 'AddEditUserController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load('modules/adminPanel/userManagement/addEditUser.controller.js');
				}],
				isAdminUserExist: function (AuthService) {
					return AuthService.isAdminUserExist();
				}
			}
		})
		.state('root.editUser', {
			url: '/user/edit/:userId',
			templateUrl: 'modules/adminPanel/userManagement/addEditUser.view.html',
			controller: 'AddEditUserController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load('modules/adminPanel/userManagement/addEditUser.controller.js');
				}],
				isAdminUserExist: function (AuthService) {
					return AuthService.isAdminUserExist();
				}
			}
		})
		.state('root.changePassword', {
			url: '/user/change-password/:userId',
			templateUrl: 'modules/adminPanel/userManagement/changePassword/changePassword.view.html',
			controller: 'ChangePwdController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load('modules/adminPanel/userManagement/changePassword/changePassword.controller.js');
				}],
				isAdminUserExist: function (AuthService) {
					return AuthService.isAdminUserExist();
				}
			}
		})
		.state('root.userList', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('root.userList.id', {
			url: '/user/list/:pageId?searchText&group',
			templateUrl: 'modules/adminPanel/userManagement/userList.view.html',
			controller: 'UserListController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/userManagement/userList.controller.js',
							'modules/adminPanel/userManagement/changePassword/changePasswordModel.controller.js'
						]
					}]);
				}],
				isAdminUserExist: function (AuthService) {
					return AuthService.isAdminUserExist();
				}
			}
		})
		.state('root.categoryList', {
			url: '/category/list?searchText&type',
			templateUrl: 'modules/adminPanel/categoryManagement/categoryList.view.html',
			controller: 'CategoryListController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/categoryManagement/categoryList.controller.js");
				}]
			}
		})
		.state('root.addCategory', {
			url: '/category/add',
			templateUrl: 'modules/adminPanel/categoryManagement/addEditMainCategory.view.html',
			controller: 'AddEditCategoryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/categoryManagement/addEditMainCategory.controller.js',
							'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
							'bower_components/ng-file-upload/ng-file-upload.min.js'
						]
					}])
				}]
			}
		})
		.state('root.editCategory', {
			url: '/category/edit/:categoryId',
			templateUrl: 'modules/adminPanel/categoryManagement/addEditMainCategory.view.html',
			controller: 'AddEditCategoryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/categoryManagement/addEditMainCategory.controller.js',
							'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
							'bower_components/ng-file-upload/ng-file-upload.min.js'
						]
					}])
				}]
			}
		})
		.state('root.addSubCategory', {
			url: '/sub-category/add',
			templateUrl: 'modules/adminPanel/categoryManagement/subCategory/addEditSubCategory.view.html',
			controller: 'AddEditSubCategoryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/categoryManagement/subCategory/addEditSubCategory.controller.js',
							'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
							'bower_components/ng-file-upload/ng-file-upload.min.js'
						]
					}]);
				}]
			}
		})
		.state('root.editSubCategory', {
			url: '/sub-category/edit/:categoryId',
			templateUrl: 'modules/adminPanel/categoryManagement/subCategory/addEditSubCategory.view.html',
			controller: 'AddEditSubCategoryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/categoryManagement/subCategory/addEditSubCategory.controller.js',
							'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
							'bower_components/ng-file-upload/ng-file-upload.min.js'
						]
					}]);
				}]
			}
		})
		.state('root.subCategoryList', {
			url: '/sub-category/:parentId',
			templateUrl: 'modules/adminPanel/categoryManagement/subCategory/subCategoryList.view.html',
			controller: 'CategoryListController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/categoryManagement/categoryList.controller.js");
				}]
			}
		})
		.state('root.addArticle', {
			url: '/article/add',
			templateUrl: 'modules/adminPanel/articleManagement/addEditArticle.view.html',
			controller: 'AddEditArticleController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							"modules/adminPanel/articleManagement/addEditArticle.controller.js",
							'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
							'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
							'bower_components/ui-cropper/compile/minified/ui-cropper.css',
							'bower_components/ui-cropper/compile/minified/ui-cropper.js',
							'partial-views/imageCropperModal/imageCropperModal.controller.js',
							'bower_components/angular-datepicker/dist/angular-datepicker.min.css'
						]
					}]);
				}]
			}
		})
		.state('root.editArticle', {
			url: '/article/:articleId',
			templateUrl: 'modules/adminPanel/articleManagement/addEditArticle.view.html',
			controller: 'AddEditArticleController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							"modules/adminPanel/articleManagement/addEditArticle.controller.js",
							'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
							'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
							'bower_components/ui-cropper/compile/minified/ui-cropper.css',
							'bower_components/ui-cropper/compile/minified/ui-cropper.js',
							'partial-views/imageCropperModal/imageCropperModal.controller.js',
							'bower_components/angular-datepicker/dist/angular-datepicker.min.css'
						]
					}]);
				}]
			}
		})
		.state('root.articleList', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('root.articleList.id', {
			url: '/article/list/:pageId?searchText&reporter&category&sectionId&city&magazine&subCategory&section',
			params: {
				pageId: {
					value: null,
					squash: true
				}
			},
			templateUrl: 'modules/adminPanel/articleManagement/articleList.view.html',
			controller: 'ArticleListController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						name: '720kb.socialshare',
						files: [
							'modules/adminPanel/articleManagement/articleList.controller.js',
							'bower_components/angular-socialshare/dist/angular-socialshare.min.js'
						]
					}]);
				}]
			}
		})
		.state('root.sectionList', {
			url: '/section/list/:pageId',
			templateUrl: 'modules/adminPanel/sectionManagement/sectionList.view.html',
			controller: 'SectionListController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/sectionManagement/sectionList.controller.js");
				}]
			}
		})
		.state('root.addSection', {
			url: '/section/add',
			templateUrl: 'modules/adminPanel/sectionManagement/addEditSection.view.html',
			controller: 'AddEditSectionController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/sectionManagement/addEditSection.controller.js");
				}]
			}
		})
		.state('root.editSection', {
			url: '/section/:sectionId',
			templateUrl: 'modules/adminPanel/sectionManagement/addEditSection.view.html',
			controller: 'AddEditSectionController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/sectionManagement/addEditSection.controller.js',
							'modules/adminPanel/sectionManagement/associateArticleToSection.controller.js'
						]
					}]);
				}]
			}
		})
		.state('root.pageList', {
			url: '/page',
			templateUrl: 'modules/adminPanel/staticPageManagement/pageList.view.html',
			controller: 'PageListController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/staticPageManagement/pageList.controller.js");
				}],
				isAdminUserExist: function (AuthService) {
					return AuthService.isAdminUserExist();
				}
			}
		})
		.state('root.editPage', {
			url: '/page/:pageId',
			templateUrl: 'modules/adminPanel/staticPageManagement/editPage.view.htm',
			controller: 'EditPageController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/staticPageManagement/editPage.controller.js");
				}],
				isAdminUserExist: function (AuthService) {
					return AuthService.isAdminUserExist();
				}
			}
		})
		.state('root.slideShowList', {
			url: '/slide-show/list/:pageId?searchText&category',
			params: {
				pageId: {
					value: null,
					squash: true
				}
			},
			templateUrl: 'modules/adminPanel/slideShow/slideShowList.view.html',
			controller: 'SlideShowController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/slideShow/slideShowList.controller.js");
				}]
			}
		})
		.state('root.addSlideShow', {
			url: '/slide-show/add',
			templateUrl: 'modules/adminPanel/slideShow/addEditSlideShow.view.html',
			controller: 'AddEditSlideShowController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/slideShow/addEditSlideShow.controller.js',
							'bower_components/ui-cropper/compile/minified/ui-cropper.css',
							'bower_components/ui-cropper/compile/minified/ui-cropper.js',
							'modules/adminPanel/slideShow/slideShowImage/addImage.controller.js',
							'components/metaTag.component.js',
							'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
							'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
							'bower_components/angular-datepicker/dist/angular-datepicker.min.css'
						]
					}]);
				}]
			}
		})
		.state('root.editSlideShow', {
			url: '/slide-show/edit/:slideShowId',
			templateUrl: 'modules/adminPanel/slideShow/addEditSlideShow.view.html',
			controller: 'AddEditSlideShowController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/slideShow/addEditSlideShow.controller.js',
							'bower_components/ui-cropper/compile/minified/ui-cropper.css',
							'bower_components/ui-cropper/compile/minified/ui-cropper.js',
							'modules/adminPanel/slideShow/slideShowImage/addImage.controller.js',
							'components/metaTag.component.js',
							'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
							'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
							'bower_components/angular-datepicker/dist/angular-datepicker.min.css'
						]
					}]);
				}]
			}
		})
		.state('root.photoGalleryList', {
			url: '/photo-gallery/list/:pageId?searchText',
			params: {
				pageId: {
					value: null,
					squash: true
				}
			},
			templateUrl: 'modules/adminPanel/photoGallery/photoGalleryList.view.html',
			controller: 'PhotoGalleryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/photoGallery/photoGalleryList.controller.js");
				}]
			}
		})
		.state('root.addPhotoGallery', {
			url: '/photo-gallery/add',
			templateUrl: 'modules/adminPanel/photoGallery/addEditPhotoGallery.view.html',
			controller: 'AddEditPhotoGalleryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/photoGallery/addEditPhotoGallery.controller.js',
							'bower_components/ui-cropper/compile/minified/ui-cropper.css',
							'bower_components/ui-cropper/compile/minified/ui-cropper.js',
							'modules/adminPanel/slideShow/slideShowImage/addImage.controller.js'
						]
					}]);
				}]
			}
		})
		.state('root.editPhotoGallery', {
			url: '/photo-gallery/edit/:photoGalleryId',
			templateUrl: 'modules/adminPanel/photoGallery/addEditPhotoGallery.view.html',
			controller: 'AddEditPhotoGalleryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/photoGallery/addEditPhotoGallery.controller.js',
							'bower_components/ui-cropper/compile/minified/ui-cropper.css',
							'bower_components/ui-cropper/compile/minified/ui-cropper.js',
							'modules/adminPanel/slideShow/slideShowImage/addImage.controller.js'
						]
					}]);
				}]
			}
		})
		.state('root.videoGalleryList', {
			url: '/video-gallery/list/:pageId?searchText&category',
			params: {
				pageId: {
					value: null,
					squash: true
				}
			},
			templateUrl: 'modules/adminPanel/videoGallery/videoGalleryList.view.html',
			controller: 'VideoGalleryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/videoGallery/videoGalleryList.controller.js");
				}]
			}
		})
		.state('root.addVideoGallery', {
			url: '/video-gallery/add',
			templateUrl: 'modules/adminPanel/videoGallery/addEditVideoGallery.view.html',
			controller: 'AddEditVideoGalleryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/videoGallery/addEditVideoGallery.controller.js',
							'components/metaTag.component.js',
							'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
							'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
							'bower_components/angular-datepicker/dist/angular-datepicker.min.css'
						]
					}]);
				}]
			}
		})
		.state('root.editVideoGallery', {
			url: '/video-gallery/edit/:galleryId',
			templateUrl: 'modules/adminPanel/videoGallery/addEditVideoGallery.view.html',
			controller: 'AddEditVideoGalleryController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/videoGallery/addEditVideoGallery.controller.js',
							'components/metaTag.component.js',
							'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
							'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
							'bower_components/angular-datepicker/dist/angular-datepicker.min.css'
						]
					}]);
				}]
			}
		})
		.state('root.manageConfig', {
			url: '/manage-config',
			templateUrl: 'modules/adminPanel/config/config.view.html',
			controller: 'ConfigController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load('modules/adminPanel/config/config.controller.js');
				}],
				isAdminAndManagerUserExist: function (AuthService) {
					return AuthService.isAdminAndManagerUserExist();
				}
			}
		})
		.state('root.subscriberList', {
			url: '/sunscriber',
			templateUrl: 'modules/adminPanel/subscriber/subscriber.view.html',
			controller: 'subscriberController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load('modules/adminPanel/subscriber/subscriber.controller.js');
				}],
				isAdminAndManagerUserExist: function (AuthService) {
					return AuthService.isAdminAndManagerUserExist();
				}
			}
		})
		.state('root.editConfig', {
			url: '/config/edit',
			templateUrl: 'modules/adminPanel/config/editConfig.view.html',
			controller: 'EditConfigController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load('modules/adminPanel/config/editConfig.controller.js');
				}],
				isAdminAndManagerUserExist: function (AuthService) {
					return AuthService.isAdminAndManagerUserExist();
				}
			}
		})
		.state('root.addAdvertise', {
			url: '/advertise/add',
			templateUrl: 'modules/adminPanel/advertiseManagement/addEditAdvertise.view.html',
			controller: 'AddEditAdvertiseController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/advertiseManagement/addEditAdvertise.controller.js',
							'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
							'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
							'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
							'bower_components/ng-file-upload/ng-file-upload.min.js'
						]
					}]);
				}]
			}
		})
		.state('root.getAdvertiseList', {
			url: '/advertise/list/:pageIndex?searchText&title&categoryId&pageType&userAgent&magazineId&cityId&position&advertiseType',
			templateUrl: 'modules/adminPanel/advertiseManagement/advertiseList.view.html',
			controller: 'AdvertiseController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/advertiseManagement/advertiseList.controller.js'
						]
					}]);
				}]
			}
		})
		.state('root.editAdvertise', {
			url: '/advertise/edit?advertiseId',
			templateUrl: 'modules/adminPanel/advertiseManagement/addEditAdvertise.view.html',
			controller: 'AddEditAdvertiseController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/advertiseManagement/addEditAdvertise.controller.js',
							'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
							'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
							'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
							'bower_components/ng-file-upload/ng-file-upload.min.js'
						]
					}]);
				}]
			}
		})
		.state('root.addAllowIp', {
			url: '/allow-ip/add',
			templateUrl: 'modules/adminPanel/config/addEditAllowIp.view.html',
			controller: 'AddEditAllowIpController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/config/addEditAllowIp.controller.js'
						]
					}]);
				}],
				isAdminAndManagerUserExist: function (AuthService) {
					return AuthService.isAdminAndManagerUserExist();
				}
			}
		})
		.state('root.editAllowIp', {
			url: '/allow-ip/edit/:allowIpId',
			templateUrl: 'modules/adminPanel/config/addEditAllowIp.view.html',
			controller: 'AddEditAllowIpController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/config/addEditAllowIp.controller.js'
						]
					}]);
				}],
				isAdminAndManagerUserExist: function (AuthService) {
					return AuthService.isAdminAndManagerUserExist();
				}
			}
		})
		.state('root.allowIpList', {
			url: '/allow-ip/list?pageIndex',
			templateUrl: 'modules/adminPanel/config/allowIpList.view.html',
			controller: 'AllowIpListController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/config/allowIpList.controller.js',
							'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
							'bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js'
						]
					}]);
				}],
				isAdminAndManagerUserExist: function (AuthService) {
					return AuthService.isAdminAndManagerUserExist();
				}
			}
		})
		.state('root.breakingNewsList', {
			url: '/article/breaking-news/list',
			templateUrl: 'modules/adminPanel/articleManagement/breakingNews.view.html',
			controller: 'BreakingNewsController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/articleManagement/breakingNews.controller.js'
						]
					}]);
				}]
			}
		})
		.state('root.reportList', {
			url: '/report/list?pageIndex&userId&startDate&endDate&categoryId&subCategoryId',
			templateUrl: 'modules/adminPanel/report/reportList.view.html',
			controller: 'ReportListController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/report/reportList.controller.js'
						]
					}]);
				}]
			}
		})
		.state('root.googleAnalytics', {
			url: '/google-analytics/report',
			templateUrl: 'modules/adminPanel/report/googleAnalyticsReport.view.html',
			controller: 'googleAnalyticsReportController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([{
						files: [
							'modules/adminPanel/report/googleAnalyticsReport.controller.js'
						]
					}]);
				}]
			}
		})
		.state('root.cityList', {
			url: '/city/list?searchText',
			templateUrl: 'modules/adminPanel/cityManagement/cityList.view.html',
			controller: 'CityListController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/cityManagement/cityList.controller.js");
				}]
			}
		})
		.state('root.addCity', {
			url: '/city/add',
			templateUrl: 'modules/adminPanel/cityManagement/addEditCity.view.html',
			controller: 'AddEditCityController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/cityManagement/addEditCity.controller.js");
				}]
			}
		})
		.state('root.editCity', {
			url: '/city/edit/:cityId',
			templateUrl: 'modules/adminPanel/cityManagement/addEditCity.view.html',
			controller: 'AddEditCityController as vm',
			resolve: {
				deps: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load("modules/adminPanel/cityManagement/addEditCity.controller.js");
				}]
			}
		});
}

function run($rootScope, $location, $http, $state, $q, $transitions, $trace, AuthService) {
	//Redirect to login if not authenticated before any transition
	//$trace.enable('TRANSITION'); /* Enable transition tracing to print transition information to the console */
	$state.defaultErrorHandler(function () {
		//Default error handler fired!
		$state.go('login');
	});
};