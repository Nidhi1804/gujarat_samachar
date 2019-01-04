'use strict';
angular.module('gujaratSamachar')
	.factory('AdminService', AdminService);

AdminService.$inject = ['$resource', '$http', 'GENERAL_CONFIG', '$q', '$location', '$state'];

function AdminService($resource, $http, GENERAL_CONFIG, $q, $location, $state) {
	var service = {
		user: user,
		addUser: addUser,
		changeUserStatus: changeUserStatus,
		checkEmailAvailablity: checkEmailAvailablity,
		categories: categories,
		changeCategoryStatus: changeCategoryStatus,
		subCategories: subCategories,
		articles: articles,
		changeArticleStatus: changeArticleStatus,
		metaTags: metaTags,
		categoryBreadCrumb: categoryBreadCrumb,
		sections: sections,
		associateArticlesToSection: associateArticlesToSection, 
		changeSectionStatus: changeSectionStatus,
		staticPages: staticPages,
		changePageStatus: changePageStatus,
		getCategoryListInfo: getCategoryListInfo,
		getAdvertiseByPosition: getAdvertiseByPosition,
		slideShow: slideShow,
		changeSlideShowStatus: changeSlideShowStatus,
		photoGallery: photoGallery,
		changePhotoGalleryStatus: changePhotoGalleryStatus,
		videoGallery: videoGallery,
		changeVideoGalleryStatus: changeVideoGalleryStatus,
		magazines: magazines,
		sectionFlags: sectionFlags,
		articleBySection: articleBySection,
		configuration: configuration,
		rpcAction: rpcAction,
		addImagePhotoGallery: addImagePhotoGallery,
		saveAdvertise: saveAdvertise,
		advertise: advertise,
		changeStatus: changeStatus,
		allowIp: allowIp,
		allowIpList: allowIpList,
		allowAll: allowAll,
		allowAllStatus: allowAllStatus,
		allowIpChangeStatus: allowIpChangeStatus,
		breakingNews: breakingNews,
		brekingNewsList: brekingNewsList,
		poster: poster,
		articleReport: articleReport,
		getSelectedCategory: getSelectedCategory,
		removeGalleryImage: removeGalleryImage,
		cities: cities,
		changeCityStatus: changeCityStatus,
		sortCity: sortCity,
		sortCategory: sortCategory,
		getSubscriberList: getSubscriberList,
		userChangePassWord: userChangePassWord,
		clearCache: clearCache
	};
	return service;

	function user(loginCredentials) {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/:userId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function addUser(loginCredentials) {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/add');
	}
	function checkEmailAvailablity() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/check-email-availablity');
	}
	function changeUserStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/change-status', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function changeCategoryStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/categories/change-status');
	}
	function categories() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/categories/:categoryId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function subCategories() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/sub-categories/:parentCatId');
	}
	function categoryBreadCrumb() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/categories/breadcrumb/:parentCatId');
	}
	function articles() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/articles/:articleId', null, {
			'update': { method: 'PUT' }
		});
	}
	// function changeArticleStatus() {
	// 	return $resource(GENERAL_CONFIG.app_base_url + '/api/articles/:articleId/change-status', null,
	// 		{
	// 			'update': { method: 'PUT' }
	// 		});
	// }
	function changeArticleStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/articles/change-status/:idList', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function metaTags() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/meta-tags');
	}
	function sections() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/sections/:sectionId', null, {
			'update': { method: 'PUT' }
		});
	}
	function associateArticlesToSection() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/sections/associate-articles');
	}
	function changeSectionStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/sections/:sectionId/change-status', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function staticPages() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/static-pages/:pageId', null, {
			'update': { method: 'PUT' }
		});
	}
	function changePageStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/static-pages/:id/change-status', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function getCategoryListInfo() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/categories/list-info');
	}
	function slideShow() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/slide-show/:slideShowId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function changeSlideShowStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/slide-show/:slideShowId/change-status', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function photoGallery() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/photo-gallery/:photoGalleryId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function changePhotoGalleryStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/photo-gallery/:photoGalleryId/change-status', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function videoGallery() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/video-gallery/:galleryId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function changeVideoGalleryStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/video-gallery/change-status/:idList', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function magazines() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/magazines');
	}
	function sectionFlags() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/section-flags');
	}
	function articleBySection() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/articles/section/:sectionId');
	}
	function configuration() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/configuration/:configId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function rpcAction(resourceUrl, method, data, param) {
		var deferred = $q.defer();
		console.log(resourceUrl, method, data, param)
		var service;
		switch (method) {
			case 'GET':
				service = resourceUrl.get(param, callback);
				break;
			case 'POST':
				service = resourceUrl.save(data, callback);
				break;
			case 'PUT':
				service = resourceUrl.update(param, data, callback);
				break;
			case 'DELETE':
				service = resourceUrl.delete(param, callback);
				break;
			default:
				service = resourceUrl.get(param, callback);
				break;
		}

		/* API callback function */
		function callback(response) {
			deferred.resolve(response);
		}
		return deferred.promise;
	}
	function addImagePhotoGallery() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/slide-show/add-image-gallery', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function saveAdvertise() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/adv');
	}
	function advertise() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/adv/:advertiseId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function getAdvertiseByPosition() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/adv-by-position/:pageType');
	}
	function changeStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/adv/change-status/:idList', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function allowIp() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/configuration/allow-ip', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function allowIpList() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/configuration/allow-ip/list')
	}
	function allowAll() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/configuration/allow-all', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function allowAllStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/configuration/allow-all/status');
	}
	function allowIpChangeStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/configuration/allow-ip/change-status/:allowIpId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function breakingNews() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/articles/breaking-news/:articleId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function brekingNewsList() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/articles/breaking-news');
	}
	function poster() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/poster/:posterId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function articleReport() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/articles/report/list', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function getSelectedCategory() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/categories/user/list');
	}
	function removeGalleryImage() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/slide-show/gallery');
	}
	function cities() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/cities/:cityId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function changeCityStatus() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/cities/change-status/:idList', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function sortCity() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/cities/sort', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function sortCategory() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/categories/sort', null,
			{
				'update': { method: 'PUT' }
			});
	}

	function getSubscriberList(){
		return $resource(GENERAL_CONFIG.app_base_url + '/api/subscriberList', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function userChangePassWord(loginCredentials) {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/change-password/:userId', null,
			{
				'update': { method: 'PUT' }
			});
	}
	function clearCache() {
		return $resource(GENERAL_CONFIG.webaApp_base_url + '/api/clearCache', null,
			{
				'update': { method: 'PUT' }
			});
	}
}
