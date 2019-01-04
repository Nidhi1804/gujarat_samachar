'use strict';
angular.module('gujaratSamachar')
    .factory('mainService', mainService);

mainService.$inject = ['$resource', '$http', 'GENERAL_CONFIG', '$q'];

function mainService($resource, $http, GENERAL_CONFIG, $q) {
    var service = {
        stories: stories,
        sectionFlags: sectionFlags,
        cities: cities,
        categories: categories,
        getSubCategories: getSubCategories,
        articleDetails: articleDetails,
        getArticleList: getArticleList,
        magazines: magazines,
        slideShow: slideShow,
        getCategory: getCategory,
        recentPost: recentPost,
        magazineList: magazineList,
        articlesByCategory: articlesByCategory,
        magazineName: magazineName,
        getDocumentById: getDocumentById,
        getCityInfoBySlug: getCityInfoBySlug,
        getGalleryList: getGalleryList,
        getMenuList: getMenuList,
        getPhotoGalleryList: getPhotoGalleryList,
        slideShowDetails: slideShowDetails,
        videoGallery: videoGallery,
        getMetaTagList: getMetaTagList,
        googleUrlShortener: googleUrlShortener,
        getBreakingNews: getBreakingNews,
        getAllTopReadNews: getAllTopReadNews,
        getAllTopHeadingNews: getAllTopHeadingNews,
        getAllRecentNews: getAllRecentNews,
        getArticlesBySection: getArticlesBySection
    };
    return service;

    function stories() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/stories/:sectionId');
    }

    function cities() {
        // return $resource(GENERAL_CONFIG.app_base_url + '/api/cities');
        return $resource(GENERAL_CONFIG.app_base_url + '/api/get-documents/:collectionName');
    }

    function categories() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/categories');
    }

    function getSubCategories() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/sub-categories')
    }

    function sectionFlags() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/section-flags');
    }

    function articleDetails() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/article-details/:categorySlug/:articleUrl');
    }

    function getArticleList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/article-list')
    }

    function magazines() {
        // return $resource(GENERAL_CONFIG.app_base_url + '/api/magazines');
        return $resource(GENERAL_CONFIG.app_base_url + '/api/get-documents/:collectionName');
    }

    function slideShow() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/slide-show')
    }

    function getCategory() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/article-category/:slug')
    }

    function recentPost() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/recent-post');
    }

    function magazineList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/magazine/:slug');
    }

    function articlesByCategory() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/articles-by-category');
    }

    function magazineName() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/magazine-name/:slug');
    }

    function getDocumentById() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/get-documents/:collectionName/:documentId')
    }

    function getCityInfoBySlug() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/get-city/:collectionName/:slug')    }

    function getGalleryList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/photo-gallery');
    }

    function getMenuList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/menu/:isMobile');
    }

    function getPhotoGalleryList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/photo-gallery/home');
    }

    function slideShowDetails() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/slide-show-details/:url/:Id')
    }

    function videoGallery() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/video-gallery/:url/:Id')
    }

    function getMetaTagList() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/meta-tag/list')
    }
    /*Convert to google short url*/
    function googleUrlShortener() {
        return $resource('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDHfiAm21vO1IAeBbRefnH0q2H_tMzpg54');
    }

    function getBreakingNews() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/breaking-news')
    }

    function getAllTopReadNews() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/top-read-news/:sectionId');
    }

    function getAllTopHeadingNews() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/top-head-news/:sectionId');
    }

    function getAllRecentNews() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/all-recent-news/:sectionId');
    }

    function getArticlesBySection() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/articles-by-section');
    }
}