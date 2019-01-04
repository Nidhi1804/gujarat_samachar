'use strict';
angular.module('gujaratSamachar')
    .factory('StaticPageService', StaticPageService);

StaticPageService.$inject = ['$resource', '$http', 'GENERAL_CONFIG', '$q'];

function StaticPageService($resource, $http, GENERAL_CONFIG, $q) {
    var service = {
        getStaticPageData: getStaticPageData,
        addSubscribeEmail: addSubscribeEmail
    };

    function getStaticPageData() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/static-page/:pageType');
    }

    function addSubscribeEmail() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/subscribe/:emailId');
    }
    return service;
}